import { Flex, Heading, Text } from '@chakra-ui/react';

export default function Home() {
  return (
    <Flex
      height="100vh"
      alignItems="center"
      justifyContent="center"
      direction="column"
    >
      <Heading>Sooro By The Whey</Heading>
      <Text>Plataforma de Acompanhamento de IMC</Text>
    </Flex>
  );
}