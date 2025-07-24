import { useEffect, useMemo, useState } from 'react';
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
    Tag,
    Badge,
    useDisclosure,
    Dialog,
    CloseButton,
    InputGroup,
    Input,
    Icon,
    Group,
    createListCollection,
    Select,
    Portal,
    IconButton
} from '@chakra-ui/react';
import { FiEdit, FiSearch, FiTrash2, FiX } from 'react-icons/fi';
import { DashboardLayout } from '@/components/layout/Dashboard';
import { useAuth } from '@/contexts/AuthContext';
import { getEvaluations, Evaluation, createEvaluation, deleteEvaluation, updateEvaluation, CreateEvaluationData } from '@/services/evaluations';
import { toaster } from '@/components/ui/toaster';
import { EvaluationForm } from '@/components/forms/EvaluationForm';
import { getUsers } from '@/services/users';

export default function EvaluationsPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    const [filtroAluno, setFiltroAluno] = useState('');
    const [filtroProfessor, setFiltroProfessor] = useState('');

    const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);

    const { data: allUsers, isLoading: isLoadingUsers } = useQuery({
        queryKey: ['allUsersForFilters'],
        queryFn: getUsers,
    });

    const { open, onOpen, onClose } = useDisclosure();
    const { open: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
    const queryClient = useQueryClient();

    const { studentsCollection, professorsCollection } = useMemo(() => {
        const students = allUsers
            ?.filter((u) => u.perfil === 'aluno')
            .map((s) => ({ label: s.nome, value: s.id })) || [];

        const professors = allUsers
            ?.filter((u) => u.perfil === 'professor')
            .map((p) => ({ label: p.nome, value: p.id })) || [];

        return {
            studentsCollection: createListCollection({ items: students }),
            professorsCollection: createListCollection({ items: professors }),
        };
    }, [allUsers]);

    const { data: evaluations, isLoading, isError } = useQuery({
        queryKey: ['evaluations', filtroAluno, filtroProfessor],
        queryFn: () => getEvaluations({ alunoId: filtroAluno, professorId: filtroProfessor })
    });

    const { mutate: handleCreateEvaluation, isPending: isCreating } = useMutation({
        mutationFn: createEvaluation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['evaluations'] });
            toaster.create({ title: 'Avaliação criada com sucesso!', type: 'success' });
            onClose();
        },
        onError: (error: any) => {
            toaster.create({
                title: 'Erro ao criar avaliação.',
                description: error.response?.data?.message || 'Verifique os dados e tente novamente.',
                type: 'error',
            });
        },
    });

    const { mutate: handleDeleteEvaluation, isPending: isDeleting } = useMutation({
        mutationFn: deleteEvaluation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['evaluations'] });
            toaster.create({ title: 'Avaliação excluída com sucesso!', type: 'success' });
            onAlertClose();
        },
        onError: (error: any) => {
            toaster.create({
                title: 'Erro ao deletar avaliação.',
                description: error.response?.data?.message || 'Verifique os dados e tente novamente.',
                type: 'error',
            });
        }
    });

    const { mutate: handleUpdateEvaluation, isPending: isUpdating } = useMutation({
        mutationFn: updateEvaluation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['evaluations'] });
            toaster.create({ title: 'Avaliação atualizada com sucesso!', type: 'success' });
            handleCloseModal();
        },
        onError: (error: any) => {
            toaster.create({
                title: 'Erro ao editar avaliação.',
                description: error.response?.data?.message || 'Verifique os dados e tente novamente.',
                type: 'error',
            });
        }
    });

    function onSubmitForm(data: CreateEvaluationData) {
        if (selectedEvaluation) {
            handleUpdateEvaluation({
                evaluationId: selectedEvaluation.id,
                data: { peso: data.peso, altura: data.altura }
            });
        } else {
            handleCreateEvaluation(data);
        }
    }

    function handleOpenEditModal(evaluation: Evaluation) {
        setSelectedEvaluation(evaluation);
        onOpen();
    }

    function handleCloseModal() {
        setSelectedEvaluation(null);
        onClose();
    }

    function handleCloseAlert() {
        setSelectedEvaluation(null);
        onAlertClose();
    }

    function confirmDelete() {
        if (selectedEvaluation) {
            handleDeleteEvaluation(selectedEvaluation.id);
        }
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
                    Minhas Avaliações
                </Heading>
                {(user?.perfil === 'admin' || user?.perfil === 'professor') && (
                    <Button onClick={onOpen}>Nova Avaliação</Button>
                )}
            </Flex>

            {user?.perfil === 'admin' && (
                <Flex mb={8} gap={4}>
                    <Select.Root
                        collection={studentsCollection}
                        width="100%"
                        onValueChange={(details) => setFiltroAluno(details.value[0] || '')}
                        disabled={isLoadingUsers}
                    >
                        <Select.Control>
                            <Select.Trigger>
                                <Select.ValueText placeholder="Filtrar por aluno..." />
                            </Select.Trigger>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner>
                                <Select.Content zIndex={"max"}>
                                    {studentsCollection.items.map((student) => (
                                        <Select.Item key={student.value} item={student}>
                                            <Select.ItemText>{student.label}</Select.ItemText>
                                            <Select.ItemIndicator />
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>

                    {filtroAluno && (
                        <IconButton
                            aria-label="Limpar filtro de aluno"
                            onClick={() => setFiltroAluno('')}
                        >
                            <FiX />
                        </IconButton>
                    )}

                    <Select.Root
                        collection={professorsCollection}
                        width="100%"
                        onValueChange={(details) => setFiltroProfessor(details.value[0] || '')}
                        disabled={isLoadingUsers}
                    >
                        <Select.Control>
                            <Select.Trigger>
                                <Select.ValueText placeholder="Filtrar por professor..." />
                            </Select.Trigger>
                        </Select.Control>
                        <Portal>
                            <Select.Positioner>
                                <Select.Content z-index={"max"}>
                                    {professorsCollection.items.map((prof) => (
                                        <Select.Item key={prof.value} item={prof}>
                                            <Select.ItemText>{prof.label}</Select.ItemText>
                                            <Select.ItemIndicator />
                                        </Select.Item>
                                    ))}
                                </Select.Content>
                            </Select.Positioner>
                        </Portal>
                    </Select.Root>

                    {filtroProfessor && (
                        <IconButton
                            aria-label="Limpar filtro de professor"
                            onClick={() => setFiltroProfessor('')}
                        >
                            <FiX />
                        </IconButton>
                    )}
                </Flex>
            )}

            <Box overflowX="auto">
                <Table.Root variant="line" colorScheme="whiteAlpha">
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader>Aluno</Table.ColumnHeader>
                            <Table.ColumnHeader>Avaliador</Table.ColumnHeader>
                            <Table.ColumnHeader>Altura (m)</Table.ColumnHeader>
                            <Table.ColumnHeader>Peso (kg)</Table.ColumnHeader>
                            <Table.ColumnHeader>IMC</Table.ColumnHeader>
                            <Table.ColumnHeader>Classificação</Table.ColumnHeader>
                            <Table.ColumnHeader>Data</Table.ColumnHeader>
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
                        {evaluations?.map((evaluation) => (
                            <Table.Row key={evaluation.id}>
                                <Table.Cell>{evaluation.aluno.nome}</Table.Cell>
                                <Table.Cell>{evaluation.avaliador.nome}</Table.Cell>
                                <Table.Cell>{evaluation.altura.toFixed(2)}</Table.Cell>
                                <Table.Cell>{evaluation.peso.toFixed(2)}</Table.Cell>
                                <Table.Cell>{evaluation.imc.toFixed(2)}</Table.Cell>
                                <Table.Cell><Badge>{evaluation.classificacao}</Badge></Table.Cell>
                                <Table.Cell>{new Date(evaluation.dtInclusao).toLocaleDateString()}</Table.Cell>
                                <Table.Cell>
                                    {(user?.perfil === 'admin' || user?.id === evaluation.avaliador.id) && (
                                        <>
                                            <IconButton
                                                aria-label="Editar avaliação"
                                                size="sm"
                                                onClick={() => handleOpenEditModal(evaluation)}
                                                mr={2}
                                            >
                                                <FiEdit />
                                            </IconButton>
                                            <IconButton
                                                aria-label="Excluir avaliação"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedEvaluation(evaluation);
                                                    onAlertOpen();
                                                }}
                                                mr={2}
                                            >
                                                <FiTrash2 />
                                            </IconButton>
                                        </>
                                    )}
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
                            <Dialog.Title>{selectedEvaluation ? 'Editar Avaliação' : 'Cadastrar Avaliação'}</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <EvaluationForm onSubmit={onSubmitForm} isSubmitting={isCreating || isUpdating} defaultValues={selectedEvaluation ?? undefined} isEditMode={!!selectedEvaluation}></EvaluationForm>
                        </Dialog.Body>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton onClick={handleCloseModal} size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>
            <Dialog.Root open={isAlertOpen} size={'md'}>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Excluir Avaliação</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            Você tem certeza? Esta ação não pode ser desfeita.
                        </Dialog.Body>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton onClick={handleCloseAlert} size="sm" />
                        </Dialog.CloseTrigger>
                        <Dialog.Footer>
                            <Button onClick={handleCloseAlert}>
                                Cancelar
                            </Button>
                            <Button onClick={confirmDelete} bgColor="red">
                                Excluir
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Dialog.Root>
        </DashboardLayout>
    );
}