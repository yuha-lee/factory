import React, { useState, useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { fetchSchema } from '../services/api';
import { renderComponent } from '../utils/renderer';
import ScrollContainer from '../components/ScrollContainer';
import Container from '../components/Container';
import Spinner from '../components/Spinner';
import Text from '../components/Text';
import { useTenant } from '../contexts/tenant/TenantContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Dynamic: { screenName: string };
};

type DynamicScreenNavProp = NativeStackNavigationProp<RootStackParamList, 'Dynamic'>;

interface RouteParams {
  screenName: string;
};

export default function DynamicScreen() {
  const route = useRoute();
  const navigation = useNavigation<DynamicScreenNavProp>();

  const { tenantId } = useTenant();
  const { screenName } = route.params as RouteParams;
  const [schema, setSchema] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSchema(tenantId, screenName)
      .then(schema => setSchema(schema))
      .catch(error => setError(error))
      .finally(() => setLoading(false));
  }, [tenantId, screenName]);

  const handleAction = (action: any) => {
    switch (action.type) {
      case 'navigate':
        navigation.replace('Dynamic', { screenName: action.screen });
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
      <Container style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner size="large" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <Text style={{ color: 'red', textAlign: 'center' }}>
          {error || '화면 정의가 없습니다.'}
        </Text>
      </Container>
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
