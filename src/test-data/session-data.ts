import fs from 'fs';
import path from 'path';

export type SessionType = 'class' | 'event' | 'workshop';

export interface MultipartFileData {
  name: string;
  mimeType: string;
  buffer: Buffer;
}

export interface SessionMultipartData {
  [key: string]: string | MultipartFileData;
  name: string;
  type: SessionType;
  description: string;
  instructorId: string;
  venue: string;
  dates: string;
  startTime: string;
  endTime: string;
  capacity: string;
  isFree: string;
  price: string;
  file: MultipartFileData;
  video: MultipartFileData;
}

const sessionFixturesDir = path.resolve(process.cwd(), 'tests/fixtures/session');
const bannerPath = path.join(sessionFixturesDir, 'banner.png');
const videoPath = path.join(sessionFixturesDir, 'banner-video.mp4');

function getTomorrowDate() {
  const kathmanduParts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kathmandu',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(new Date());
  const getPart = (type: 'year' | 'month' | 'day') =>
    Number(kathmanduParts.find((part) => part.type === type)?.value);
  const tomorrow = new Date(
    Date.UTC(getPart('year'), getPart('month') - 1, getPart('day') + 1),
  );

  return tomorrow.toISOString().slice(0, 10);
}

export function createSessionMultipartData(
  instructorId: string,
  type: SessionType = 'class',
): SessionMultipartData {
  const timestamp = Date.now();

  return {
    name: `E2E ${type} Session ${timestamp}`,
    type: type,
    description: '<p>this is for workshop</p>',
    instructorId,
    venue: 'kathmandu',
    dates: getTomorrowDate(),
    startTime: '00:21',
    endTime: '23:59',
    capacity: '122',
    isFree: 'true',
    price: '0',
    file: {
      name: 'banner.png',
      mimeType: 'image/png',
      buffer: fs.readFileSync(bannerPath),
    },
    video: {
      name: 'banner-video.mp4',
      mimeType: 'video/mp4',
      buffer: fs.readFileSync(videoPath),
    },
  };
}
