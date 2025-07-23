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
        <Flex
        as="header"
        w="100%"
        px="8"
        h="20"
        align="center"
        borderBottomWidth="1px"
        borderColor="gray.200"
        bgColor="gray.100"
        justify="space-between"
        height="10vh"
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
                    <Menu.Content >
                        <Menu.Item value="perfil">Perfil</Menu.Item>
                        <Menu.Item value="logout" onClick={signOut}>Sair</Menu.Item>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
      </Flex>

      <Flex w="100%" maxW={1480} x="6" height="90vh">
        <Box as="aside" w="64">
            <Stack align="stretch" width={"100%"} height={"100%"} borderRightWidth={"1px"}>
                <Link href="/dashboard" passHref>
                    <Button as="a" variant="ghost" justifyContent="flex-start" width={"100%"}>Dashboard</Button>
                </Link>
                {user?.perfil === 'admin' && (
                    <Link href="/users" passHref>
                        <Button as="a" variant="ghost" justifyContent="flex-start" width={"100%"}>Usuários</Button>
                    </Link>
                )}
                <Link href="/evaluations" passHref>
                    <Button as="a" variant="ghost" justifyContent="flex-start"  width={"100%"}>Avaliações</Button>
                </Link>
            </Stack>
        </Box>

        <Box flex="1" padding={6}>{children}</Box>
      </Flex>
    </Flex>
  );
}