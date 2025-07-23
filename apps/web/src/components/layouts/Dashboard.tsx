import { ReactNode } from 'react';
import { Box, Flex, Heading, Portal, Avatar, Menu, Stack, Button} from '@chakra-ui/react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, signOut } = useAuth();

  return (
    <Flex direction="column" h="100vh">
      {/* Header */}
        <Flex
        as="header"
        w="100%"
        px="8"
        h="20"
        align="center"
        borderBottomWidth="1px"
        borderColor="gray.700"
        justify="space-between"
        >
        <Heading size="md">Sooro IMC</Heading>
        <Menu.Root>
            <Menu.Trigger rounded={"full"} focusRing={"outside"}>
                <Avatar.Root size="md">
                    <Avatar.Fallback name={user?.nome}>

                    </Avatar.Fallback>
                </Avatar.Root>
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                    <Menu.Content>
                        <Menu.Item value="perfil">Perfil</Menu.Item>
                        <Menu.Item value="logout" onClick={signOut}>Sair</Menu.Item>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
      </Flex>

      <Flex w="100%" my="6" maxW={1480} mx="auto" px="6">
        {/* Sidebar */}
        <Box as="aside" w="64" mr="8">
            <Stack align="stretch">
                <Link href="/dashboard" passHref>
                    <Button as="a" variant="ghost" justifyContent="flex-start">Dashboard</Button>
                </Link>
                {user?.perfil === 'admin' && (
                    <Link href="/users" passHref>
                        <Button as="a" variant="ghost" justifyContent="flex-start">Usuários</Button>
                    </Link>
                )}
                <Link href="/evaluations" passHref>
                    <Button as="a" variant="ghost" justifyContent="flex-start">Avaliações</Button>
                </Link>
            </Stack>
        </Box>

        {/* Main Content */}
        <Box flex="1">{children}</Box>
      </Flex>
    </Flex>
  );
}