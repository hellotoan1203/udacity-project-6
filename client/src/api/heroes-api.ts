import { apiEndpoint } from '../config'
import { Hero } from '../types/Hero';
import { CreateHeroRequest } from '../types/CreateHeroRequest';
import Axios from 'axios'
import { UpdateHeroRequest } from '../types/UpdateHeroRequest';

export async function getHeros(idToken: string): Promise<Hero[]> {
  console.log('Fetching Heros')

  const response = await Axios.get(`${apiEndpoint}/heroes`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Heros:', response.data)
  return response.data.items
}

export async function createHero(
  idToken: string,
  newHero: CreateHeroRequest
): Promise<Hero> {
  const response = await Axios.post(`${apiEndpoint}/heroes`,  JSON.stringify(newHero), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchHero(
  idToken: string,
  heroId: string,
  updatedHero: UpdateHeroRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/heroes/${heroId}`, JSON.stringify(updatedHero), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteHero(
  idToken: string,
  heroId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/heroes/${heroId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  heroId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/heroes/${heroId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
