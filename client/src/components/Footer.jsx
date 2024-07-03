import React from "react";
import { Flex, Stack, Heading, Text, Image } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Footer = () => {
  const technologyStack = [
    "React JS",
    "Express JS",
    "Node JS",
    "MongoDB",
  ];

  const features = [
    "Habit Tracking",
    "Streak Building",
    "Bad Habit Breaker",
    "Progress Visualization",
    "Reminder & Notifications",
    "Leader Board",
  ];

  return (
    <>
      <Stack
        className="footer-container"
        bgColor="#141925"
        flexDir={["column", "column", "row", "row"]}
        color="white"
        justifyContent="space-between"
        px={8}
        py={4}
        top="100%"
      >
        <Stack
          className="foot-1"
          flexDir={["row", "row", "column", "column"]}
          justifyContent={[
            "space-between",
            "space-between",
            "flex-start",
            "flex-start",
          ]}
        >
          <Flex flexDir="column" py={2}>
            <Heading as="h3" size="lg" mb={4}>
              About
            </Heading>
            <Link to={"/write-us"}>Support</Link>
            <a
              href="mailto:mukundmadhav054@gmail.com?subject=Regarding HabTrackIt"
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact Us
            </a>
            <Link to={"/faq"}>FAQ</Link>
          </Flex>

          <Flex flexDir="column" py={2}>
            <Heading as="h3" size="lg" mb={4}>
              Technology Used
            </Heading>
            {technologyStack.map((tech, index) => (
              <Text key={index} fontSize="md">
                {tech}
              </Text>
            ))}
          </Flex>
        </Stack>
        <Stack className="foot-2">
          <Flex flexDir="column" py={2}>
            <Heading as="h3" size="lg" mb={4}>
              Features
            </Heading>
            {features.map((feature, index) => (
              <Text key={index} fontSize="md">
                {feature}
              </Text>
            ))}
          </Flex>
          <Flex
            className="social-link-container"
            justifyContent={["center", "center", "flex-start", "flex-start"]}
            mt={[20, 20, 0, 0]}
            columnGap={4}
          >
            <a
              href="https://www.linkedin.com/in/imukundmadhav/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="./LinkedIn.svg" />
            </a>
            <a
              href="https://www.github.com/mukundmadhav054"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="./GitHub.svg" />
            </a>
            <a
              href="https://www.instagram.com/mukund__here"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="./Instagram.svg" />
            </a>
          </Flex>
        </Stack>
        <Stack
          className="foot-3"
          align={["center", "center", "flex-start", "flex-start"]}
        >
          <Flex
            flexDir="column"
            rowGap={4}
            mt={4}
            align={["center", "center", "flex-start", "flex-start"]}
          >
            <Image
              src="./HabTrackIt Logo.svg"
              alt="HabTrackIt Logo"
              w="170px"
              h="53px"
            />
            <Flex
              flexDir="column"
              align={["center", "center", "flex-start", "flex-start"]}
            >
              <Text fontSize="xs">©2024 Copyrighted by Mukund Madhav. </Text>
              <Text fontSize="xs">All rights reserved.</Text>
            </Flex>
          </Flex>
        </Stack>
      </Stack>
    </>
  );
};

export default Footer;
