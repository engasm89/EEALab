-- V2 seed updates: real-ish demo links, assets, lifecycle examples

update public.projects
set
  demo_type = 'external',
  demo_embed_url = null,
  screenshot_urls = array[
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80',
    'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=1600&q=80'
  ],
  repo_url = 'https://github.com/ashraf-lab/esp32-mqtt-lab',
  demo_url = 'https://example.com/esp32-mqtt-lab',
  course_waitlist_url = 'https://example.com/waitlist/embedded-lab',
  client_inquiry_url = 'https://example.com/inquiry/embedded',
  updated_at = now()
where slug = 'esp32-mqtt-lab';

update public.projects
set
  demo_type = 'iframe',
  demo_embed_url = 'https://example.com/saas-productivity/embed',
  screenshot_urls = array[
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1600&q=80'
  ],
  repo_url = 'https://github.com/ashraf-lab/saas-productivity-tool',
  demo_url = 'https://example.com/saas-productivity',
  beta_url = 'https://example.com/beta/saas-productivity',
  updated_at = now()
where slug = 'saas-productivity-tool';

update public.projects
set
  demo_type = 'external',
  screenshot_urls = array[
    'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1600&q=80'
  ],
  repo_url = 'https://github.com/ashraf-lab/ai-assistant-building-lab',
  demo_url = 'https://example.com/ai-assistant',
  beta_url = 'https://example.com/beta/ai-assistant',
  updated_at = now()
where slug = 'ai-assistant-building-lab';

update public.projects
set
  demo_type = 'screenshots',
  screenshot_urls = array[
    'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?auto=format&fit=crop&w=1600&q=80'
  ],
  course_waitlist_url = 'https://example.com/waitlist/engineering-foundations',
  course_url = 'https://example.com/course-preview/foundations',
  updated_at = now()
where slug = 'online-course-foundations';

update public.projects
set
  demo_type = 'external',
  screenshot_urls = array[
    'https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=1600&q=80'
  ],
  demo_url = 'https://example.com/experimental-edge-tool',
  beta_url = 'https://example.com/beta/edge-tool',
  updated_at = now()
where slug = 'experimental-edge-tool';

insert into public.project_assets (project_id, asset_type, url, caption, sort_order)
select id, 'screenshot', screenshot_urls[1], 'Main preview', 0
from public.projects
where array_length(screenshot_urls, 1) > 0
on conflict do nothing;

insert into public.feature_requests (project_id, fingerprint, request_text, status, public_note, target_release)
select id, 'seed-fingerprint-1', 'Add offline-first sync', 'planned', 'Planned for next sprint.', 'Q2'
from public.projects where slug = 'saas-productivity-tool'
on conflict do nothing;

insert into public.feature_requests (project_id, fingerprint, request_text, status, public_note, target_release)
select id, 'seed-fingerprint-2', 'Add template library', 'in_progress', 'Currently shipping this in iterations.', 'Q2'
from public.projects where slug = 'ai-assistant-building-lab'
on conflict do nothing;

insert into public.feature_requests (project_id, fingerprint, request_text, status, public_note, target_release)
select id, 'seed-fingerprint-3', 'Device health dashboard', 'shipped', 'Shipped with recent dashboard update.', 'Q1'
from public.projects where slug = 'esp32-mqtt-lab'
on conflict do nothing;

insert into public.feedback (project_id, fingerprint, comment, visibility_status, is_featured)
select id, 'seed-feedback-1', 'The progress logs make this very actionable. Keep posting latency numbers.', 'approved', true
from public.projects where slug = 'experimental-edge-tool';

