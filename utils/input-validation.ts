export function sanitizeInput(input: string): string {
  // Remove potentially harmful characters
  return input.replace(/[<>"'&]/g, "").trim()
}

export function validateInvestmentAmount(amount: string): { isValid: boolean; error?: string } {
  const numericValue = Number.parseFloat(amount.replace(/[^0-9.]/g, ""))

  if (isNaN(numericValue)) {
    return { isValid: false, error: "Please enter a valid number" }
  }

  if (numericValue <= 0) {
    return { isValid: false, error: "Investment amount must be greater than zero" }
  }

  if (numericValue > 10000000) {
    return { isValid: false, error: "Investment amount cannot exceed $10,000,000" }
  }

  return { isValid: true }
}

export function validatePortfolioName(name: string): { isValid: boolean; error?: string } {
  const sanitized = sanitizeInput(name)

  if (!sanitized || sanitized.length === 0) {
    return { isValid: false, error: "Portfolio name is required" }
  }

  if (sanitized.length > 100) {
    return { isValid: false, error: "Portfolio name cannot exceed 100 characters" }
  }

  return { isValid: true }
}

export function validateSearchQuery(query: string): { isValid: boolean; error?: string } {
  const sanitized = sanitizeInput(query)

  if (sanitized.length > 50) {
    return { isValid: false, error: "Search query cannot exceed 50 characters" }
  }

  // Check for potentially malicious patterns
  const maliciousPatterns = [/script/i, /javascript/i, /vbscript/i, /onload/i, /onerror/i]

  for (const pattern of maliciousPatterns) {
    if (pattern.test(sanitized)) {
      return { isValid: false, error: "Invalid search query" }
    }
  }

  return { isValid: true }
}
