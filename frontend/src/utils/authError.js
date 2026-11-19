export const getAuthErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  const responseData = error.response?.data
  const validationMessage = responseData?.errors?.[0]?.msg
  const message = validationMessage || responseData?.message

  if (!message) {
    return fallback
  }

  if (message.toLowerCase() === 'invalid email or password') {
    return 'Invalid email or password.'
  }

  if (message.toLowerCase().includes('email')) {
    return 'Please enter a valid email address.'
  }

  if (message.toLowerCase().includes('password')) {
    return 'Password must be at least 8 characters long.'
  }

  return message
}
