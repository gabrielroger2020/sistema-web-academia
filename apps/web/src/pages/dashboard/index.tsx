import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Flex, Heading, Text } from '@chakra-ui/react';
import { DashboardLayout } from '@/components/layout/Dashboard';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Guardião de Autenticação
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // Se não for autenticado, não renderiza nada para evitar piscar de tela
  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout>
      <Flex direction="column">
        <Heading>Bem-vindo ao Dashboard!</Heading>
        <Text>Navegue pelo menu lateral para começar.</Text>
      </Flex>
    </DashboardLayout>
  );
}