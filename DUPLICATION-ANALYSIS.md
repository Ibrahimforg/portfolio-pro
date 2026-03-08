/**
 * ANALYSE MINUTIEUSE - DUPLICATIONS ET INCOHÉRENCES
 * 
 * ❌ DUPLICATIONS DÉTECTÉES :
 * 
 * 1. INTERFACES Project (7 occurrences) :
 *    - src/components/ProjectCard.tsx (lignes 9-24)
 *    - src/app/projects/[slug]/page.tsx (lignes 29-55)
 *    - src/app/projects/page.tsx (lignes 9-24)
 *    - src/app/page.tsx (lignes 12-24)
 *    - src/app/multimedia/page.tsx (lignes 21-24)
 *    - src/app/admin/projects/page.tsx (lignes 21-24)
 *    - src/app/admin/dashboard/page.tsx (lignes 26-29)
 * 
 * 2. INTERFACES Skill (5 occurrences) :
 *    - src/app/skills/page.tsx (lignes 17-28)
 *    - src/app/multimedia/page.tsx (lignes 36-39)
 *    - src/app/admin/skills/[id]/edit/page.tsx (lignes 16-30)
 *    - src/app/admin/skills/page.tsx (lignes 20-34)
 *    - src/app/about/enhanced-page.tsx (lignes 53-56)
 * 
 * 3. INTERFACES Contact (2 occurrences) :
 *    - src/app/admin/contacts/page.tsx (lignes 23-31)
 *    - src/app/admin/contact/page.tsx (lignes 23-31)
 * 
 * 4. INTERFACES Experience (4 occurrences) :
 *    - src/components/ExperienceTimeline.tsx (lignes 6-12)
 *    - src/app/admin/experiences/page.tsx (lignes 21-29)
 *    - src/app/about/enhanced-page.tsx (lignes 32-36)
 *    - src/app/about/page.tsx (lignes 9-21)
 * 
 * 5. INTERFACES Category (6 occurrences) :
 *    - src/app/skills/page.tsx (lignes 30-36)
 *    - src/app/projects/page.tsx (lignes 26-31)
 *    - src/app/admin/skills/[id]/edit/page.tsx (lignes 32-35)
 *    - src/app/admin/skills/page.tsx (lignes 36-40)
 *    - src/app/admin/projects/new/page.tsx (lignes 18-21)
 *    - src/app/admin/projects/page.tsx (lignes 38-42)
 *    - src/app/admin/projects/[id]/edit/page.tsx (lignes 21-24)
 * 
 * ⚠️ INCOHÉRENCES DÉTECTÉES :
 * 
 * 1. Project interface variations :
 *    - Certains ont 'order_index', d'autres 'order'
 *    - Certains ont 'technologies[]', d'autres pas
 *    - Champs 'featured_image' vs 'featured_image_url'
 * 
 * 2. Skill interface variations :
 *    - 'level' string vs 'level': 'Expert' | 'Advanced' | 'Intermediate'
 *    - 'years_experience' vs 'years_experience' | null
 *    - 'category_id' présent/absent selon les fichiers
 * 
 * 3. Category interface variations :
 *    - 'order' vs 'order_index'
 *    - 'icon' présent/absent
 *    - 'color' présent/absent
 * 
 * 🔧 SOLUTIONS RECOMMANDÉES :
 * 
 * 1. CRÉER INTERFACES CENTRALISÉES :
 *    - src/types/index.ts avec toutes les interfaces unifiées
 *    - Exporter types Database depuis supabase.ts
 *    - Utiliser partout les mêmes interfaces
 * 
 * 2. NETTOYER LES DUPLICATIONS :
 *    - Supprimer les interfaces locales
 *    - Importer depuis types/index.ts
 *    - Standardiser les noms de champs
 * 
 * 3. VALIDER SCHÉMA BDD :
 *    - Comparer avec database/portfolio-ultimate-schema.sql
 *    - S'assurer que les interfaces matchent exactement
 *    - Ajouter les champs manquants
 */
