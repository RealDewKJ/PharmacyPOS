// Simple test script for authentication endpoints
const API_BASE = 'http://localhost:3001'

async function testAuth() {
  console.log('🧪 Testing Authentication Endpoints...\n')

  try {
    // Test 1: Login with valid credentials
    console.log('1. Testing login with valid credentials...')
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@pharmacy.com',
        password: 'admin123'
      })
    })

    if (loginResponse.ok) {
      const loginData = await loginResponse.json()
      console.log('✅ Login successful')
      console.log(`   Token: ${loginData.token.substring(0, 20)}...`)
      console.log(`   User: ${loginData.user.name} (${loginData.user.role})`)
      
      // Test 2: Get current user with token
      console.log('\n2. Testing /auth/me endpoint...')
      const meResponse = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${loginData.token}`
        }
      })

      if (meResponse.ok) {
        const meData = await meResponse.json()
        console.log('✅ /auth/me successful')
        console.log(`   User: ${meData.user.name} (${meData.user.role})`)
      } else {
        console.log('❌ /auth/me failed:', meResponse.status)
      }

      // Test 3: Test protected route without token
      console.log('\n3. Testing protected route without token...')
      const noTokenResponse = await fetch(`${API_BASE}/auth/me`)
      
      if (noTokenResponse.status === 401) {
        console.log('✅ Correctly rejected request without token')
      } else {
        console.log('❌ Should have rejected request without token')
      }

      // Test 4: Test users endpoint (should be public)
      console.log('\n4. Testing /users endpoint (public)...')
      const usersResponse = await fetch(`${API_BASE}/users`)
      
      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        console.log('✅ /users endpoint accessible (public)')
        console.log(`   Found ${usersData.users.length} users`)
      } else {
        console.log('❌ /users endpoint failed:', usersResponse.status)
      }

      // Test 5: Test profile update
      console.log('\n5. Testing profile update...')
      const profileResponse = await fetch(`${API_BASE}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loginData.token}`
        },
        body: JSON.stringify({
          name: 'Admin User Updated'
        })
      })

      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        console.log('✅ Profile update successful')
        console.log(`   Updated name: ${profileData.user.name}`)
      } else {
        console.log('❌ Profile update failed:', profileResponse.status)
      }

    } else {
      console.log('❌ Login failed:', loginResponse.status)
      const errorData = await loginResponse.json()
      console.log('   Error:', errorData.message)
    }

  } catch (error) {
    console.log('❌ Test failed:', error.message)
  }

  console.log('\n🏁 Authentication tests completed!')
}

// Run the test
testAuth()
