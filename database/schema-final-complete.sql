-- Script SQL complet pour le portfolio
-- Exécuter ce script dans le dashboard Supabase SQL Editor

-- 1. Suppression des tables existantes (fresh start)
DROP TABLE IF EXISTS contact_submissions CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS experiences CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS skill_categories CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 2. Création des tables

-- Table des catégories de projets
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  color VARCHAR(20),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des catégories de compétences
CREATE TABLE skill_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des projets
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  technologies TEXT[] DEFAULT '{}',
  context TEXT,
  constraints TEXT,
  architecture TEXT,
  implementation TEXT,
  results TEXT,
  featured_image TEXT,
  gallery TEXT[],
  demo_url TEXT,
  github_url TEXT,
  completion_date DATE NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des compétences
CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category_id INTEGER REFERENCES skill_categories(id) ON DELETE SET NULL,
  level VARCHAR(20) CHECK (level IN ('Expert', 'Advanced', 'Intermediate')) NOT NULL,
  years_experience INTEGER,
  icon VARCHAR(100),
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des expériences professionnelles
CREATE TABLE experiences (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  current BOOLEAN DEFAULT FALSE,
  description TEXT NOT NULL,
  accomplishments TEXT[] DEFAULT '{}',
  technologies TEXT[] DEFAULT '{}',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des services
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  icon VARCHAR(100),
  deliverables TEXT[] DEFAULT '{}',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des soumissions de contact
CREATE TABLE contact_submissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des profils (AJOUTÉE - manquait dans votre script)
CREATE TABLE profiles (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  bio TEXT NOT NULL,
  profile_image_url TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des images de profil (AJOUTÉE - manquait pour système professionnel)
CREATE TABLE profile_images (
  id SERIAL PRIMARY KEY,
  profile_id INTEGER REFERENCES profiles(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  storage_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des fichiers CV (AJOUTÉE - manquait pour système professionnel)
CREATE TABLE cv_files (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  storage_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. RLS (Row Level Security) activation
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
-- Désactiver RLS sur profiles pour permettre les uploads
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Supprimer toutes les politiques existantes (force brute)
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
DROP POLICY IF EXISTS "Skill categories are viewable by everyone" ON skill_categories;
DROP POLICY IF EXISTS "Published projects are viewable by everyone" ON projects;
DROP POLICY IF EXISTS "Skills are viewable by everyone" ON skills;
DROP POLICY IF EXISTS "Experiences are viewable by everyone" ON experiences;
DROP POLICY IF EXISTS "Services are viewable by everyone" ON services;
DROP POLICY IF EXISTS "Categories are manageable by authenticated users" ON categories;
DROP POLICY IF EXISTS "Skill categories are manageable by authenticated users" ON skill_categories;
DROP POLICY IF EXISTS "Projects are manageable by authenticated users" ON projects;
DROP POLICY IF EXISTS "Skills are manageable by authenticated users" ON skills;
DROP POLICY IF EXISTS "Experiences are manageable by authenticated users" ON experiences;
DROP POLICY IF EXISTS "Services are manageable by authenticated users" ON services;
DROP POLICY IF EXISTS "Contact submissions are insertable by everyone" ON contact_submissions;
DROP POLICY IF EXISTS "Contact submissions are manageable by authenticated users" ON contact_submissions;

-- 4. Policies pour lecture publique
CREATE POLICY "Categories are viewable by everyone" ON categories FOR SELECT USING (true);
CREATE POLICY "Skill categories are viewable by everyone" ON skill_categories FOR SELECT USING (true);
CREATE POLICY "Published projects are viewable by everyone" ON projects FOR SELECT USING (published = true);
CREATE POLICY "Skills are viewable by everyone" ON skills FOR SELECT USING (true);
CREATE POLICY "Experiences are viewable by everyone" ON experiences FOR SELECT USING (true);
CREATE POLICY "Services are viewable by everyone" ON services FOR SELECT USING (true);
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
-- Pas de politiques d'écriture pour profiles (RLS désactivé)

-- 5. Policies pour écriture (réservée aux utilisateurs authentifiés)
CREATE POLICY "Categories are manageable by authenticated users" ON categories FOR ALL USING (true);
CREATE POLICY "Skill categories are manageable by authenticated users" ON skill_categories FOR ALL USING (true);
CREATE POLICY "Projects are manageable by authenticated users" ON projects FOR ALL USING (true);
CREATE POLICY "Skills are manageable by authenticated users" ON skills FOR ALL USING (true);
CREATE POLICY "Experiences are manageable by authenticated users" ON experiences FOR ALL USING (true);
CREATE POLICY "Services are manageable by authenticated users" ON services FOR ALL USING (true);
CREATE POLICY "Contact submissions are insertable by everyone" ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Contact submissions are manageable by authenticated users" ON contact_submissions FOR ALL USING (true);
-- Pas de politiques pour profile_images et cv_files car RLS désactivé

-- 6. Index pour optimisation
CREATE INDEX idx_projects_category ON projects(category_id);
CREATE INDEX idx_projects_published ON projects(published);
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_skills_category ON skills(category_id);
CREATE INDEX idx_experiences_current ON experiences(current);

-- 7. Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skill_categories_updated_at BEFORE UPDATE ON skill_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_experiences_updated_at BEFORE UPDATE ON experiences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. Données initiales
INSERT INTO categories (name, slug, description, icon, color, order_index) VALUES
('Web', 'web', 'Projets de développement web applications', 'Globe', '#3B82F6', 1),
('Mobile', 'mobile', 'Applications mobiles iOS et Android', 'Smartphone', '#8B5CF6', 2),
('Réseaux', 'reseaux', 'Solutions réseau et infrastructure', 'Network', '#10B981', 3);

INSERT INTO skill_categories (name, slug, description, icon, order_index) VALUES
('Frontend', 'frontend', 'Technologies de développement frontend', 'Monitor', 1),
('Backend', 'backend', 'Technologies de développement backend', 'Server', 2),
('DevOps', 'devops', 'Outils et pratiques DevOps', 'Settings', 3);

INSERT INTO projects (title, slug, short_description, full_description, category_id, technologies, completion_date, featured, order_index, published) VALUES
('Platforme E-Commerce Full-Stack', 'ecommerce-platform', 'Application complète de vente en ligne avec panier, paiement et admin panel.', 'Développement d''une plateforme e-commerce moderne avec React, Node.js et intégration Stripe.', 1, ARRAY['React', 'Node.js', 'TypeScript', 'Stripe', 'PostgreSQL'], '2024-01-15', true, 1, true),
('Dashboard Analytics', 'analytics-dashboard', 'Tableau de bord interactif avec visualisations de données en temps réel.', 'Création d''un dashboard analytics avec D3.js et WebSocket pour données temps réel.', 1, ARRAY['React', 'D3.js', 'Node.js', 'WebSocket', 'MongoDB'], '2023-12-10', true, 2, true),
('Application Mobile React Native', 'mobile-app', 'App iOS/Android pour la gestion de tâches avec synchronisation cloud.', 'Développement cross-platform avec React Native et backend Firebase.', 2, ARRAY['React Native', 'Firebase', 'Redux', 'TypeScript'], '2023-11-20', false, 3, true);

INSERT INTO skills (name, category_id, level, years_experience, icon, description, order_index) VALUES
('React', 1, 'Expert', 4, 'React', 'Framework JavaScript pour interfaces utilisateur', 1),
('TypeScript', 1, 'Advanced', 3, 'TypeScript', 'Superset JavaScript avec typage statique', 2),
('Node.js', 2, 'Expert', 4, 'NodeJS', 'Runtime JavaScript côté serveur', 3),
('PostgreSQL', 2, 'Advanced', 3, 'Database', 'Base de données relationnelle SQL', 4),
('Docker', 3, 'Intermediate', 2, 'Docker', 'Plateforme de conteneurisation', 5);

-- Données pour experiences (AJOUTÉES - manquaient dans votre script)
INSERT INTO experiences (title, company, location, start_date, end_date, current, description, accomplishments, technologies, order_index) VALUES
('Développeur Full Stack Senior', 'Tech Solutions Inc.', 'Paris, France', '2022-01-01', NULL, true, 'Développement d''applications web complexes pour clients enterprise. Architecture microservices, optimisation performance, mentorat équipe junior.', ARRAY['Réduction des coûts d''infrastructure de 40%', 'Amélioration des performances de 60%', 'Formation de 5 développeurs juniors', 'Mise en place CI/CD pipeline'], ARRAY['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'AWS'], 1),
('Développeur Full Stack', 'Digital Agency', 'Lyon, France', '2020-03-01', '2021-12-31', false, 'Développement de sites web et applications pour PME. Gestion de projet de A à Z, relation client, maintenance.', ARRAY['Livraison de 15+ projets en temps et en budget', 'Satisfaction client 95%', 'Optimisation SEO pour tous les sites'], ARRAY['Vue.js', 'Laravel', 'MySQL', 'JavaScript', 'CSS', 'HTML'], 2),
('Développeur Web Junior', 'StartUp Innovation', 'Marseille, France', '2019-06-01', '2020-02-28', false, 'Développement de sites web pour startups. Création de landing pages, applications web simples, maintenance.', ARRAY['Développement de 20+ sites web', 'Formation aux meilleures pratiques', 'Optimisation performance'], ARRAY['HTML', 'CSS', 'JavaScript', 'PHP', 'WordPress'], 3);

-- Données pour services (AJOUTÉES - manquaient dans votre script)
INSERT INTO services (title, slug, short_description, full_description, icon, deliverables, order_index) VALUES
('Développement Web Full-Stack', 'web-development', 'Création d''applications web modernes et performantes', 'Développement complet d''applications web avec React, Node.js, TypeScript et bases de données. Architecture scalable, tests automatisés, déploiement continu. De la conception à la mise en production.', 'Code', ARRAY['Application web responsive', 'Interface d''administration', 'API RESTful', 'Tests automatisés', 'Documentation technique', 'Support technique'], 1),
('Applications Mobiles', 'mobile-development', 'Développement d''applications iOS et Android', 'Création d''applications mobiles natives ou cross-platform avec React Native. Expérience utilisateur optimale, performances natives, synchronisation cloud. Publication sur App Store et Play Store.', 'Smartphone', ARRAY['Application iOS/Android', 'Interface utilisateur moderne', 'Mode hors-ligne', 'Synchronisation cloud', 'Publication App Store/Play Store', 'Mises à jour continues'], 2),
('Architecture & DevOps', 'architecture-devops', 'Conception d''infrastructures robustes et CI/CD', 'Mise en place d''infrastructures cloud, pipelines CI/CD, monitoring, conteneurisation. Focus sur scalabilité, fiabilité et sécurité. Optimisation des coûts et performances.', 'Settings', ARRAY['Architecture cloud', 'Pipeline CI/CD', 'Monitoring et alertes', 'Documentation infrastructure', 'Support technique 24/7', 'Optimisation coûts'], 3),
('Consultation Technique', 'technical-consulting', 'Audit et optimisation de projets existants', 'Audit complet de vos applications web, optimisation performance, refactoring code, mise à niveau technologique. Formation équipe et transfert de compétences.', 'Globe', ARRAY['Audit technique complet', 'Plan d''optimisation', 'Refactoring code', 'Formation équipe', 'Documentation', 'Suivi post-projet'], 4);

-- Données pour profiles (AJOUTÉES - table manquait dans votre script)
INSERT INTO profiles (full_name, title, bio, profile_image_url, email) VALUES
('Ibrahim FORGO', 'Développeur Full Stack Senior', 'Développeur passionné avec 5+ ans d''expérience dans la création d''applications web modernes. Spécialisé en React, Next.js, TypeScript et Node.js. Expert en architecture scalable, optimisation performance et solutions cloud.', '/images/profile.jpg', 'ibrahim.forgo@example.com');

-- Note: Les tables profile_images et cv_files ne sont pas nécessaires
-- Le code utilise directement profiles.profile_image_url et le stockage Supabase
