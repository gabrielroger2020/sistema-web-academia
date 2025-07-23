import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Flex,
  Heading,
  Button,
  Table,
  Spinner,
  Text,
  Badge,
} from '@chakra-ui/react';
import { DashboardLayout } from '@/components/layout/Dashboard';
import { useAuth } from '@/contexts/AuthContext';
import { getUsers, User } from '@/services/users';

export default function UserManagementPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const { data: users, isLoading, isError } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers
    });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    } else if (user?.perfil !== 'admin') {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.perfil !== 'admin') {
    return <Spinner />;
  }

  return (
    <DashboardLayout>
      <Flex mb="8" justify="space-between" align="center">
        <Heading size="lg" fontWeight="normal">
          Gerenciamento de Usuários
        </Heading>
        <Button colorScheme="blue">Novo Usuário</Button>
      </Flex>

      <Box overflowX="auto">
        <Table.Root variant="line" colorScheme="whiteAlpha">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Nome</Table.ColumnHeader>
              <Table.ColumnHeader>Usuário</Table.ColumnHeader>
              <Table.ColumnHeader>Perfil</Table.ColumnHeader>
              <Table.ColumnHeader>Situação</Table.ColumnHeader>
              <Table.ColumnHeader>Ações</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {isLoading && (
              <Table.Row>
                <Table.Cell colSpan={5} textAlign="center"><Spinner /></Table.Cell>
              </Table.Row>
            )}
            {isError && (
                <Table.Row>
                    <Table.Cell colSpan={5} textAlign="center"><Text color="red.500">Erro ao carregar usuários.</Text></Table.Cell>
                </Table.Row>
            )}
            {users?.map((user) => (
              <Table.Row key={user.id}>
                <Table.Cell>{user.nome}</Table.Cell>
                <Table.Cell>{user.usuario}</Table.Cell>
                <Table.Cell>{user.perfil}</Table.Cell>
                <Table.Cell>
                    <Badge colorScheme={user.situacao === 'ativo' ? 'green' : 'red'}>
                        {user.situacao}
                    </Badge>
                </Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </DashboardLayout>
  );
}