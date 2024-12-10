import { Injectable } from '@angular/core';
import { SupabaseService } from '../shared/supabase.service';

export interface Profile {
  id: string;
  username: string;
  email: string;
  avatar_url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private supabase: SupabaseService) {}

  async createProfile(profile: Omit<Profile, 'avatar_url'>): Promise<Profile> {
    const { data, error } = await this.supabase.supabaseClient
      .from('profiles')
      .insert(profile)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await this.supabase.supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  }

  async updateProfile(profile: Partial<Profile>): Promise<Profile> {
    const { data, error } = await this.supabase.supabaseClient
      .from('profiles')
      .update(profile)
      .eq('id', profile.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  
}

