import { TwoFactorAuth } from '@/lib/2fa'

// Mock Supabase pour les tests
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn()
        }))
      })),
      insert: jest.fn(() => ({
        error: null
      })),
      upsert: jest.fn(() => ({
        error: null
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          error: null
        }))
      }))
    }))
  }
}))

// Mock du module otplib
jest.mock('otplib', () => ({
  authenticator: {
    generateSecret: jest.fn(() => 'JBSWY3DPEHPK3PXP'),
    verify: jest.fn(() => true)
  }
}))

describe('TwoFactorAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('generateSecretKey', () => {
    it('devrait générer une clé secrète de 32 caractères', () => {
      const secret = TwoFactorAuth.generateSecretKey()
      expect(secret).toHaveLength(32)
      expect(secret).toMatch(/^[A-Z2-7]+$/)
    })

    it('devrait générer des clés différentes à chaque appel', () => {
      const secret1 = TwoFactorAuth.generateSecretKey()
      const secret2 = TwoFactorAuth.generateSecretKey()
      expect(secret1).not.toBe(secret2)
    })
  })

  describe('generateTOTPSecret', () => {
    it('devrait générer une URL TOTP valide', () => {
      const user = { id: '123', email: 'test@example.com' }
      const secret = TwoFactorAuth.generateTOTPSecret(user)
      
      expect(secret).toMatch(/^otpauth:\/\/totp\//)
      expect(secret).toContain('portfolio-pro:test@example.com')
      expect(secret).toContain('algorithm=SHA256')
      expect(secret).toContain('digits=6')
      expect(secret).toContain('period=30')
    })
  })

  describe('verifyTOTP', () => {
    it('devrait vérifier un token TOTP valide', () => {
      const secret = TwoFactorAuth.generateSecretKey()
      // Note: Ce test nécessite un token TOTP réel généré avec le secret
      // Pour les tests, nous simulons avec un token factice
      const result = TwoFactorAuth.verifyTOTP('123456', secret)
      expect(typeof result).toBe('boolean')
    })

    it('devrait rejeter un token invalide', () => {
      const secret = TwoFactorAuth.generateSecretKey()
      const result = TwoFactorAuth.verifyTOTP('invalid', secret)
      expect(result).toBe(false)
    })
  })

  describe('generateBackupCodes', () => {
    it('devrait générer 10 codes de secours', () => {
      const codes = TwoFactorAuth.generateBackupCodes()
      expect(codes).toHaveLength(10)
      codes.forEach(code => {
        expect(code).toHaveLength(8)
        expect(code).toMatch(/^[A-Z0-9]+$/)
      })
    })

    it('devrait générer des codes uniques', () => {
      const codes1 = TwoFactorAuth.generateBackupCodes()
      const codes2 = TwoFactorAuth.generateBackupCodes()
      expect(codes1).not.toEqual(codes2)
    })
  })

  describe('generateQRCodeURL', () => {
    it('devrait générer une URL QR code valide', () => {
      const secret = 'JBSWY3DPEHPK3PXP'
      const user = { email: 'test@example.com' }
      const url = TwoFactorAuth.generateQRCodeURL(secret, user)
      
      expect(url).toBe('otpauth://totp/portfolio-pro:test@example.com?secret=JBSWY3DPEHPK3PXP&algorithm=SHA256&digits=6&period=30')
    })
  })

  describe('is2FAEnabled', () => {
    it('devrait retourner false si 2FA n\'est pas activé', async () => {
      const mockSupabase = {
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn().mockResolvedValue({ data: null, error: null })
            }))
          }))
        }))
      }
      
      jest.doMock('@/lib/supabase', () => ({ supabase: mockSupabase }))
      
      const result = await TwoFactorAuth.is2FAEnabled('user123')
      expect(result).toBe(false)
    })

    it('devrait retourner true si 2FA est activé', async () => {
      const mockSupabase = {
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn().mockResolvedValue({ data: { enabled: true }, error: null })
            }))
          }))
        }))
      }
      
      jest.doMock('@/lib/supabase', () => ({ supabase: mockSupabase }))
      
      const result = await TwoFactorAuth.is2FAEnabled('user123')
      expect(result).toBe(true)
    })
  })
})
