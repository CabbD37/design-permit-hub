
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Content table
CREATE TABLE public.site_content (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Admins insert content" ON public.site_content FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update content" ON public.site_content FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete content" ON public.site_content FOR DELETE
  USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER site_content_touch BEFORE UPDATE ON public.site_content
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Seed content
INSERT INTO public.site_content (key, value) VALUES
-- Home
('home.hero.eyebrow', 'Long Beach & Los Angeles County, California'),
('home.hero.title', 'Architectural blueprints designed for city approval.'),
('home.hero.body', 'Proven Design & Consulting bridges architectural vision and municipal requirements — delivering permit-ready design sets and full-service city submittals across Long Beach and Los Angeles County.'),
('home.hero.cta_primary', 'View Services'),
('home.hero.cta_secondary', 'Start a Project'),
('home.service_1.title', 'Architectural Design'),
('home.service_1.desc', 'Concepts, floor plans, and spatial layouts tailored to California coastal density and residential zoning.'),
('home.service_2.title', 'Assistance with Pre-Approved Plans'),
('home.service_2.desc', 'Construction documents with structural details and Title 24 compliance, ready for plan check.'),
('home.service_3.title', 'City Submittals'),
('home.service_3.desc', 'We handle the plan check process, corrections and approvals on your behalf.'),
('home.why.title', 'Local knowledge is the difference between a project and a permit.'),
('home.why_1.title', 'Long Beach & LA County Specialists'),
('home.why_1.desc', 'Deep familiarity with Long Beach Development Services, LA County Building & Safety, Specific Plans, and Coastal Zone requirements.'),
('home.why_2.title', 'Permit-First Drafting'),
('home.why_2.desc', 'Sets are built to be read by plan-checkers, contractors, and inspectors alike — minimizing corrections and field changes.'),
('home.why_3.title', 'Full-Service Expediting'),
('home.why_3.desc', 'From feasibility review to final approval, we handle the bureaucracy so your construction stays on schedule.'),
('home.cta.title', 'Start your submittal.'),
('home.cta.body', 'Schedule a consultation or send preliminary sketches for a project feasibility review.'),
('home.cta.button', 'Request Consultation'),
('home.cta.phone', '(562) 555-0128'),
('home.cta.phone_href', 'tel:+15625550128'),

-- Services
('services.hero.eyebrow', 'Capabilities'),
('services.hero.title', 'Three services. One approval-first process.'),
('services.hero.body', 'We design, draft, and shepherd projects through the City of Long Beach so construction starts on schedule.'),
('services.s1.title', 'Architectural Design'),
('services.s1.intro', 'Concept-through-design-development for residential additions, ADUs, remodels, and small commercial projects.'),
('services.s1.bullets', 'Site analysis and feasibility review|Schematic floor plans|Design development drawings|Material and finish guidance'),
('services.s2.title', 'Permit Set of Blueprints'),
('services.s2.intro', 'Complete construction documents engineered to pass plan check on the first or second round.'),
('services.s2.bullets', 'Architectural floor, elevation, and section drawings|Site, roof, and demolition plans|Title 24 energy compliance documentation|Coordination with structural, MEP, and Title 24 consultants'),
('services.s3.title', 'Permitting & City Submittals'),
('services.s3.intro', 'End-to-end expediting across Los Angeles County and Orange County, focusing in Long Beach and City of LA.'),
('services.s3.bullets', 'Pre-application meetings and zoning research|Plan-check submittal and routing|Corrections and resubmittals|Final permit issuance and inspection support'),
('services.process.title', 'A clear path from sketch to permit.'),
('services.process_1.title', 'Consultation'),
('services.process_1.desc', 'We review your site, scope, and goals.'),
('services.process_2.title', 'Design'),
('services.process_2.desc', 'Schematic plans and design development.'),
('services.process_3.title', 'Permit Set'),
('services.process_3.desc', 'Construction documents and Title 24.'),
('services.process_4.title', 'Submittal'),
('services.process_4.desc', 'Plan-check, corrections, approval.'),
('services.cta.title', 'Have a project in mind?'),
('services.cta.body', 'Tell us about your site and timeline. We''ll respond within one business day.'),

-- Contact
('contact.hero.eyebrow', 'Contact'),
('contact.hero.title', 'Let''s review your project.'),
('contact.hero.body', 'Send a few details about your site and goals. We respond within one business day.'),
('contact.phone', '(562) 555-0128'),
('contact.phone_href', 'tel:+15625550128'),
('contact.email', 'Danny@provendcservices.com'),
('contact.office', 'Long Beach, California'),
('contact.service_area', 'Los Angeles County, Orange County, focusing in Long Beach and City of LA.'),
('contact.hours', 'Monday–Friday, 9am–6pm PT');

-- Create admin user
DO $$
DECLARE
  new_user_id UUID := gen_random_uuid();
BEGIN
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, email_change, email_change_token_new, recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000', new_user_id, 'authenticated', 'authenticated',
    'danielcarlos37@gmail.com',
    crypt('xGCvBPkbKFJ@1LpqBTeH', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb, now(), now(), '', '', '', ''
  );

  INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  VALUES (gen_random_uuid(), new_user_id,
    jsonb_build_object('sub', new_user_id::text, 'email', 'danielcarlos37@gmail.com', 'email_verified', true),
    'email', 'danielcarlos37@gmail.com', now(), now(), now());

  INSERT INTO public.user_roles (user_id, role) VALUES (new_user_id, 'admin');
END $$;
