import { useEffect, useState } from 'react';
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
    Tag,
    Badge,
} from '@chakra-ui/react';
import { DashboardLayout } from '@/components/layout/Dashboard';
import { useAuth } from '@/contexts/AuthContext';
import { getEvaluations, Evaluation } from '@/services/evaluations';

export default function EvaluationsPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const { data: evaluations, isLoading, isError } = useQuery({
        queryKey: ['evaluations'],
        queryFn: () => getEvaluations()
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
                    Minhas Avaliações
                </Heading>
                {(user?.perfil === 'admin' || user?.perfil === 'professor') && (
                    <Button>Nova Avaliação</Button>
                )}
            </Flex>

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
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </Box>
        </DashboardLayout>
    );
}