import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { fetchTheme, fetchSchema } from '../services/api';
import { renderComponent } from '../utils/renderer';
import ScrollContainer from '../components/ScrollContainer';
import Spinner from '../components/Spinner';
import { getTenantConfig } from '../config/tenant';

interface DynamicScreenProps {
  route: { params: { screenName: string } };
  navigation: any;
}

export default function DynamicScreen({ route, navigation }: DynamicScreenProps) {
  const { screenName } = route.params;
  const { tenantId } = getTenantConfig();
  const [schema, setSchema] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const ui = await fetchSchema(tenantId, screenName);
        if (!isMounted) {
          return;
        }
        setSchema(ui);
      } catch (err) {
        console.error('Failed to load schema:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    load();
    return () => { isMounted = false; };
  }, [tenantId, screenName]);

  const handleAction = (action: any) => {
    switch (action.type) {
      case 'navigate':
        navigation.navigate(action.screen, { screenName: action.screen });
        break;
      case 'api':
        // TODO: API 호출 액션
        break;
      // 기타 action 타입 처리
      default:
        console.warn('Unhandled action:', action);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner size="large" />
      </View>
    );
  }

  return (
    <ScrollContainer>
      {schema?.components?.map((component: any) =>
        renderComponent(component, handleAction)
      )}
    </ScrollContainer>
  );
}
