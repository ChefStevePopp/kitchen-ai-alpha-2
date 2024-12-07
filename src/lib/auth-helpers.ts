import { supabase } from './supabase';

export async function getUserOrganization() {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError) throw authError;
  if (!user) throw new Error('Not authenticated');

  const organizationId = user.user_metadata?.organizationId || 'c1e1f1b1-1e1e-1e1e-1e1e-1e1e1e1e1e1e';

  // Verify organization access
  const { data: orgRole, error: roleError } = await supabase
    .from('organization_roles')
    .select('role')
    .eq('organization_id', organizationId)
    .eq('user_id', user.id)
    .single();

  if (roleError && roleError.code !== 'PGRST116') {
    throw roleError;
  }

  // Check if user is dev
  const isDev = user.user_metadata?.system_role === 'dev' || 
                user.user_metadata?.role === 'dev';

  if (!orgRole && !isDev) {
    throw new Error('No organization access');
  }

  return {
    userId: user.id,
    organizationId,
    role: orgRole?.role || 'owner',
    isDev
  };
}