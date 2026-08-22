export function validateLogin(body) {
  const errors = [];

  if (!body || typeof body !== 'object') {
    return { valid: false, errors: ['Invalid request body'] };
  }

  if (!body.email || typeof body.email !== 'string' || body.email.trim() === '') {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    errors.push('Please provide a valid email address');
  }

  if (!body.password || typeof body.password !== 'string' || body.password === '') {
    errors.push('Password is required');
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : null
  };
}

export function validateSignup(body) {
  const errors = [];

  if (!body || typeof body !== 'object') {
    return { valid: false, errors: ['Invalid request body'] };
  }

  if (!body.firstName || typeof body.firstName !== 'string' || body.firstName.trim() === '') {
    errors.push('First name is required');
  }

  if (!body.lastName || typeof body.lastName !== 'string' || body.lastName.trim() === '') {
    errors.push('Last name is required');
  }

  if (!body.email || typeof body.email !== 'string' || body.email.trim() === '') {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    errors.push('Please provide a valid email address');
  }

  if (!body.password || typeof body.password !== 'string' || body.password === '') {
    errors.push('Password is required');
  } else if (body.password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : null
  };
}
