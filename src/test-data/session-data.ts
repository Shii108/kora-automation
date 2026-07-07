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

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return formatDate(tomorrow);
}

export function createSessionMultipartData(
  instructorId: string,
  type: SessionType = 'class',
): SessionMultipartData {
  const timestamp = Date.now();

  return {
    name: `${type} Session ${timestamp}`,
    type: type,
    description: '<p>this is for workshop</p>',
    instructorId,
    venue: 'kathmandu',
    dates: getTomorrowDate(),
    startTime: '00:21',
    endTime: '23:59',
    capacity: '122',
    isFree: 'false',
    price: '100',
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
