// 'use server'

// import { checkRole } from '../../../utils/roles'
// import { clerkClient } from '@clerk/nextjs/server'

// export async function setRole(formData: FormData) {
//   const client = await clerkClient()

//   // Check that the user trying to set the role is an admin
//   if (!checkRole('hospital_admin')) {
//     return { message: 'Not Authorized' }
//   }

//   try {
//     const res = await client.users.updateUserMetadata(formData.get('id') as string, {
//       publicMetadata: { role: formData.get('role') },
//     })
//     return { message: res.publicMetadata }
//   } catch (err) {
//     return { message: err }
//   }
// }

// export async function removeRole(formData: FormData) {
//   const client = await clerkClient()

//   try {
//     const res = await client.users.updateUserMetadata(formData.get('id') as string, {
//       publicMetadata: { role: null },
//     })
//     return { message: res.publicMetadata }
//   } catch (err) {
//     return { message: err }
//   }
// }
'use server'

import { checkRole } from '../../../utils/roles'
import { clerkClient } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export async function setRole(formData: FormData) {
  const client = await clerkClient()

  // Ensure only admins can change roles
  if (!checkRole('hospital_admin')) {
    return
  }

  try {
    await client.users.updateUserMetadata(formData.get('id') as string, {
      publicMetadata: { role: formData.get('role') },
    })
  } catch (err) {
    console.error('Error updating role:', err)
  }

  redirect('/admin-dashboard') // Redirect to refresh the UI
}

export async function removeRole(formData: FormData) {
  const client = await clerkClient()

  try {
    await client.users.updateUserMetadata(formData.get('id') as string, {
      publicMetadata: { role: null },
    })
  } catch (err) {
    console.error('Error removing role:', err)
  }

  redirect('/admin-dashboard') // Redirect to refresh the UI
}
