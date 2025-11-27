import type { City } from '../utils/types';

export interface MasterProfile {
  experience: number;
  description: string;
  pseudonym: string;
  phoneNumber: string;
  workingHours: string;
  skills: string[];
}

export interface UserExtended {
  id: string;
  email: string;
  name: string;
  surname: string;
  patronymic: string;
  avatarPath: string;
  city: City;
  master: MasterProfile;
}
