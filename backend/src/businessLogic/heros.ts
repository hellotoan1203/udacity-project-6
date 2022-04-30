import { HerosAccess } from '../dataLayer/HerosAcess'
import { AttachmentUtils } from '../fileStorage/attachmentUtils';
import { HeroItem } from '../models/HeroItem'
import { HeroUpdate } from '../models/HeroUpdate'
import { CreateHeroRequest } from '../requests/CreateHeroRequest'
import { UpdateHeroRequest } from '../requests/UpdateHeroRequest'

import * as uuid from 'uuid'

const herosAccess = new HerosAccess();
const accessFile = new AttachmentUtils();

export async function createAttachmentPresignedUrl(userId: string, heroId: string): Promise<String> {
  const uploadUrl = await accessFile.getUploadUrl(heroId);
  const attachmentUrl = accessFile.getAttachmentUrl(heroId);
  await herosAccess.updateAttachmentUrl(userId, heroId, attachmentUrl);
  return uploadUrl;
}

export async function getAllHeros(userId: string): Promise<HeroItem[]> {
  return herosAccess.getAllHeros(userId);
}

export async function createHero(createHeroRequest: CreateHeroRequest, userId: string): Promise<HeroItem> {

  const heroId = uuid.v4();
  const timestamp = new Date().toISOString();

  return await herosAccess.createHero({
    userId: userId,
    heroId: heroId,
    createdAt: timestamp,
    name: createHeroRequest.name,
    dueDate: createHeroRequest.dueDate,
    done: false
  });
}

export async function updateHero(heroId: string, updateHeroRequest: UpdateHeroRequest, userId: string): Promise<HeroUpdate> {

  return await herosAccess.updateHero({
    name: updateHeroRequest.name,
    dueDate: updateHeroRequest.dueDate,
    done: updateHeroRequest.done
  },
    heroId,
    userId);
}

export async function deleteHero(heroId: string, userId: string) {
  await herosAccess.deleteHero(heroId, userId)
}