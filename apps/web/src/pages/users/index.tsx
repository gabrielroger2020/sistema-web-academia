import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    Box,
    Flex,
    Heading,
    Button,
    Table,
    Spinner,
    Text,
    Badge,
    Dialog,
    CloseButton,
    useDisclosure,
    Switch,
    IconButton
} from '@chakra-ui/react';
import { DashboardLayout } from '@/components/layout/Dashboard';
import { useAuth } from '@/contexts/AuthContext';
import { getUsers, User, createUser, CreateUserData, updateUserStatus, updateUser } from '@/services/users';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { UserForm } from '@/components/forms/UserForm';
import { toaster } from '@/components/ui/toaster';

export default function UserManagementPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { open, onOpen, onClose } = useDisclosure();

    const { data: users, isLoading, isError } = useQuery({
        queryKey: ['users'],
        queryFn: getUsers
    });

    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const { mutate: handleCreateUser, isPending: isCreatingUser } = useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toaster.create({ title: 'Usuário criado com sucesso!', type: 'success' });
            onClose();
        },
        onError: (error: any) => {
            console.log(error);
            toaster.create({ title: 'Erro ao criar usuário.', description: error.response?.data?.error || 'Ocorreu um erro.', type: 'error' });
        },
    });

    const { mutate: handleUpdateStatus } = useMutation({
        mutationFn: updateUserStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toaster.create({ title: 'Status do usuário atualizado!', type: 'success' });
        },
        onError: () => {
            toaster.create({ title: 'Erro ao atualizar status.', type: 'error' });
        },
    });

    const { mutate: handleUpdateUser, isPending: isUpdatingUser } = useMutation({
        mutationFn: updateUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toaster.create({ title: 'Usuário atualizado com sucesso!', type: 'success' });
            onClose();
        },
        onError: (error: any) => {
            toaster.create({ title: 'Erro ao criar usuário.', description: error.response?.data?.error || 'Ocorreu um erro.', type: 'error' });
        },
    });

    function onSubmitForm(data: Partial<CreateUserData>) {
        if(selectedUser){
            handleUpdateUser({ userId: selectedUser.id, data });
        }else{
            handleCreateUser(data as CreateUserData);
        }
    }

    function handleOpenEditModal(userToEdit: User){
        setSelectedUser(userToEdit);
        onOpen();
    }

    function handleCloseModal(){
        onClose();
        setSelectedUser(null);
    }

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
                <Button onClick={onOpen}>Novo Usuário</Button>
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
                                    <Switch.Root checked={user.situacao === "ativo"} onChange={(e) =>
                                        handleUpdateStatus({
                                            userId: user.id,
                                            status: (e.target as HTMLInputElement).checked ? "ativo" : "inativo"
                                        })
                                    }>
                                        <Switch.HiddenInput />
                                        <Switch.Control>
                                        </Switch.Control>
                                    </Switch.Root>
                                </Table.Cell>
                                <Table.Cell>
                                    <IconButton aria-label='Editar usuário' size="sm" onClick={() => handleOpenEditModal(user)}>
                                        <FiEdit></FiEdit>
                                    </IconButton>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </Box>
            <Dialog.Root open={open} size={'md'}>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>{selectedUser ? 'Editar Usuário' : 'Cadastrar Usuário'}</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <UserForm onSubmit={onSubmitForm} isSubmitting={isCreatingUser || isUpdatingUser} defaultValues={selectedUser ?? undefined} isEditMode={!!selectedUser}></UserForm>
                        </Dialog.Body>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton onClick={onClose} size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>
        </DashboardLayout>
    );
}