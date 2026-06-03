-- Migration 002: Données initiales
-- Date: 2026-03-28
-- Description: Insertion des données de base

-- Catégories de projets
INSERT INTO categories (name, slug, description, icon, color, order_index) VALUES
('Web Applications', 'web-applications', 'Applications web modernes et responsive', 'globe', 'blue', 1),
('Mobile Apps', 'mobile-apps', 'Applications mobiles natives et hybrides', 'smartphone', 'green', 2),
('API Development', 'api-development', 'API RESTful et microservices', 'server', 'purple', 3),
('UI/UX Design', 'ui-ux-design', 'Design d''interface et expérience utilisateur', 'palette', 'pink', 4);

-- Catégories de compétences
INSERT INTO skill_categories (name, slug, description, icon, order_index) VALUES
('Frontend', 'frontend', 'Technologies de développement frontend', 'code', 1),
('Backend', 'backend', 'Technologies de développement backend', 'server', 2),
('Database', 'database', 'Bases de données et gestion de données', 'database', 3),
('DevOps', 'devops', 'Outils et pratiques DevOps', 'cloud', 4),
('Design', 'design', 'Outils de design et prototypage', 'palette', 5);

-- Services
INSERT INTO services (title, slug, description, icon, featured, order_index) VALUES
('Développement Web Full-Stack', 'developpement-web-full-stack', 'Création d''applications web complètes du frontend au backend', 'code', true, 1),
('Design UI/UX', 'design-ui-ux', 'Conception d''interfaces utilisateur modernes et intuitives', 'palette', true, 2),
('Optimisation Performance', 'optimisation-performance', 'Amélioration des performances et du SEO de vos applications', 'zap', false, 3),
('Consultation Technique', 'consultation-technique', 'Accompagnement technique et architectural pour vos projets', 'lightbulb', false, 4);
