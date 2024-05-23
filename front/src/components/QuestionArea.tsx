"use client";
import { useDateInfo, useNickname } from "@/app/providers";
import {
  Button,
  Textarea,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import React, { useState } from "react";

const QuestionArea = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [question, setQuestion] = useState("");
  const { today } = useDateInfo();
  const { nickname, isNickname } = useNickname();

  async function postQuestion() {
    const userQuestion = {
      title: question,
      author_nickname: nickname,
      date: today,
    };
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/qna/addQuestion/`,
        {
          method: "POST",
          body: JSON.stringify(userQuestion),
          headers: {
            "content-type": "application/json",
          },
        }
      );
      if (res.ok) {
        console.log("질문 등록 완료");
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      <Button
        color="primary"
        variant="ghost"
        isDisabled={isNickname}
        onPress={onOpen}
      >
        질문하기
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">질문</ModalHeader>
              <ModalBody>
                <Textarea
                  autoFocus
                  label="Question"
                  placeholder="질문을 입력하세요"
                  variant="bordered"
                  onChange={(e) => {
                    setQuestion((prev) => e.target.value);
                  }}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onClick={() => postQuestion()}
                  onPress={onClose}
                >
                  접속
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default QuestionArea;
