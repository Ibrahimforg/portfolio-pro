// 2FA Implementation avec TOTP - Version simplifiée
import { supabase } from '@/lib/supabase'

export class TwoFactorAuth {
  static generateSecretKey(): string {
    // Générer un secret TOTP simple
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
    let result = ''
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  static generateTOTPSecret(user: { id: string; email: string }): string {
    // Générer une clé TOTP compatible Google Authenticator
    return `otpauth://totp/portfolio-pro:${user.email}?secret=${this.generateSecretKey()}&algorithm=SHA256&digits=6&period=30`
  }

  static verifyTOTP(token: string, _secret: string): boolean {
    // Simulation de vérification TOTP (à remplacer par vraie implémentation)
    try {
      // Pour l'instant, accepter les codes à 6 chiffres
      return /^\d{6}$/.test(token)
    } catch {
      console.error('Erreur vérification TOTP')
      return false
    }
  }

  static generateQRCodeURL(secret: string, user: { email: string }): string {
    return `otpauth://totp/portfolio-pro:${user.email}?secret=${secret}&algorithm=SHA256&digits=6&period=30`
  }

  static async enable2FA(userId: string): Promise<{ success: boolean; secret?: string; qrCodeUrl?: string; error?: string }> {
    try {
      // Vérifier si 2FA est déjà activé
      const { data: existing2FA } = await supabase
        .from('user_2fa')
        .select('enabled')
        .eq('user_id', userId)
        .single()

      if (existing2FA?.enabled) {
        return { success: false, error: '2FA déjà activé' }
      }

      // Générer le secret TOTP
      const secret = TwoFactorAuth.generateTOTPSecret({ id: userId, email: '' })
      
      // Sauvegarder en base de données (non activé pour l'instant)
      const { error } = await supabase
        .from('user_2fa')
        .upsert({
          user_id: userId,
          secret: secret,
          enabled: false, // Non activé jusqu'à vérification
          backup_codes: JSON.stringify(TwoFactorAuth.generateBackupCodes()),
          created_at: new Date().toISOString()
        })

      if (error) {
        return { success: false, error: 'Erreur sauvegarde secret 2FA' }
      }

      // Générer l'URL QR code
      const { data: user } = await supabase
        .from('profiles')
        .select('email')
        .eq('user_id', userId)
        .single()

      const qrCodeUrl = user?.email ? TwoFactorAuth.generateQRCodeURL(secret, user) : undefined

      return { 
        success: true, 
        secret, 
        qrCodeUrl 
      }
    } catch (error) {
      console.error('Erreur activation 2FA:', error)
      return { success: false, error: 'Erreur interne' }
    }
  }

  static async verifyAndEnable2FA(userId: string, token: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Récupérer le secret TOTP
      const { data: user2FA, error } = await supabase
        .from('user_2fa')
        .select('secret, enabled')
        .eq('user_id', userId)
        .single()

      if (error || !user2FA) {
        return { success: false, error: 'Configuration 2FA non trouvée' }
      }

      if (user2FA.enabled) {
        return { success: false, error: '2FA déjà activé' }
      }

      // Vérifier le token
      const isValid = TwoFactorAuth.verifyTOTP(token, user2FA.secret)
      
      if (!isValid) {
        return { success: false, error: 'Code 2FA invalide' }
      }

      // Activer 2FA
      const { error: updateError } = await supabase
        .from('user_2fa')
        .update({ 
          enabled: true,
          activated_at: new Date().toISOString()
        })
        .eq('user_id', userId)

      if (updateError) {
        return { success: false, error: 'Erreur activation 2FA' }
      }

      return { success: true }
    } catch (error) {
      console.error('Erreur vérification 2FA:', error)
      return { success: false, error: 'Erreur interne' }
    }
  }

  static async verify2FA(userId: string, token: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: user2FA, error } = await supabase
        .from('user_2fa')
        .select('secret, enabled')
        .eq('user_id', userId)
        .single()

      if (error || !user2FA) {
        return { success: false, error: 'Configuration 2FA non trouvée' }
      }

      if (!user2FA.enabled) {
        return { success: false, error: '2FA non activé' }
      }

      const isValid = TwoFactorAuth.verifyTOTP(token, user2FA.secret)
      
      if (!isValid) {
        return { success: false, error: 'Code 2FA invalide' }
      }

      return { success: true }
    } catch (error) {
      console.error('Erreur vérification 2FA:', error)
      return { success: false, error: 'Erreur interne' }
    }
  }

  static async disable2FA(userId: string, token: string): Promise<{ success: boolean; error?: string }> {
    try {
      // D'abord vérifier le token 2FA
      const verification = await TwoFactorAuth.verify2FA(userId, token)
      if (!verification.success) {
        return verification
      }

      // Désactiver 2FA
      const { error } = await supabase
        .from('user_2fa')
        .update({ 
          enabled: false,
          disabled_at: new Date().toISOString()
        })
        .eq('user_id', userId)

      if (error) {
        return { success: false, error: 'Erreur désactivation 2FA' }
      }

      return { success: true }
    } catch (error) {
      console.error('Erreur désactivation 2FA:', error)
      return { success: false, error: 'Erreur interne' }
    }
  }

  static generateBackupCodes(): string[] {
    const codes: string[] = []
    for (let i = 0; i < 10; i++) {
      codes.push(Math.random().toString(36).substring(2, 10).toUpperCase())
    }
    return codes
  }

  static async verifyBackupCode(userId: string, code: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: user2FA } = await supabase
        .from('user_2fa')
        .select('backup_codes')
        .eq('user_id', userId)
        .single()

      if (!user2FA) {
        return { success: false, error: 'Configuration 2FA non trouvée' }
      }

      const backupCodes = JSON.parse(user2FA.backup_codes || '[]')
      const codeIndex = backupCodes.indexOf(code.toUpperCase())

      if (codeIndex === -1) {
        return { success: false, error: 'Code de secours invalide' }
      }

      // Supprimer le code utilisé
      backupCodes.splice(codeIndex, 1)
      
      await supabase
        .from('user_2fa')
        .update({ backup_codes: JSON.stringify(backupCodes) })
        .eq('user_id', userId)

      return { success: true }
    } catch {
      console.error('Erreur vérification code secours')
      return { success: false, error: 'Erreur interne' }
    }
  }

  static async is2FAEnabled(userId: string): Promise<boolean> {
    try {
      const { data: user2FA } = await supabase
        .from('user_2fa')
        .select('enabled')
        .eq('user_id', userId)
        .single()

      return user2FA?.enabled || false
    } catch {
      return false
    }
  }
}
