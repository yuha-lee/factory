-- Insert initial UI schemas from filesystem data

-- Insert home screen schema for tenantA
insert into public.ui_schemas (tenant_id, screen_name, schema_content) values (
  'tenantA',
  'home',
  '{
    "screen": "home",
    "components": [
      {
        "type": "Container",
        "id": "main",
        "props": {
          "style": {
            "padding": 20,
            "backgroundColor": "#F0F0F0"
          }
        },
        "children": [
          {
            "type": "Text",
            "id": "welcome",
            "children": "UI 테스트 화면",
            "props": {
              "style": {
                "fontSize": 18,
                "marginBottom": 16
              }
            }
          },
          {
            "type": "Button",
            "id": "nextBtn",
            "props": {
              "text": "다음 화면",
              "style": {
                "backgroundColor": "#6200EE",
                "padding": 12
              },
              "textStyle": {
                "color": "#FFFFFF"
              }
            },
            "action": {
              "type": "navigate",
              "screen": "sudoku"
            }
          }
        ]
      }
    ]
  }'::jsonb
);

-- Insert sudoku screen schema for tenantA  
insert into public.ui_schemas (tenant_id, screen_name, schema_content) values (
  'tenantA',
  'sudoku', 
  '{
    "screen": "home",
    "components": [
      {
        "type": "Container",
        "id": "main",
        "props": {
          "style": {
            "padding": 20,
            "backgroundColor": "#F0F0F0"
          }
        },
        "children": [
          {
            "type": "Text",
            "id": "welcome",
            "children": "스도쿠 화면",
            "props": {
              "style": {
                "fontSize": 18,
                "marginBottom": 16
              }
            }
          },
          {
            "type": "Button",
            "id": "nextBtn",
            "props": {
              "text": "home",
              "style": {
                "backgroundColor": "#6200EE",
                "padding": 12
              },
              "textStyle": {
                "color": "#FFFFFF"
              }
            },
            "action": {
              "type": "navigate",
              "screen": "home"
            }
          }
        ]
      }
    ]
  }'::jsonb
);