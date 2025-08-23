-- Insert tenant themes from YAML data
INSERT INTO public.tenant_themes (tenant_id, theme) VALUES 
('tenantA', '{
  "name": "Tenant A App",
  "colors": {
    "primary": "#2196F3",
    "background": "#FFFFFF"
  },
  "logo": "https://cdn.example.com/tenantA/logo.png"
}'),
('tenantB', '{
  "name": "Tenant B App",
  "colors": {
    "primary": "#4CAF50",
    "background": "#F0F0F0"
  },
  "logo": "https://cdn.example.com/tenantB/logo.png"
}');
