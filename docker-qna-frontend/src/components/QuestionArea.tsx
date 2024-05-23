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
import React, { useState, useEffect } from "react";

const QuestionArea = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [question, setQuestion] = useState("");
  const { today } = useDateInfo();
  const { nickname, isNickname } = useNickname();
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<
    { file: File; url: string }[]
  >([]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach(({ url }) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  async function postQuestion() {
    const imageBase64Array = await Promise.all(
      images.map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      })
    );
    const userQuestion = {
      title: question,
      author_nickname: nickname,
      date: today,
      images: imageBase64Array,
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
        setQuestion("");
        setImages([]);
        setImagePreviews([]);
        window.location.reload(); 
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: File[] = Array.from(files);
      setImages((prevImages) => [...prevImages, ...newImages]);
      const newImagePreviews = newImages.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));
      setImagePreviews((prevPreviews) => [
        ...prevPreviews,
        ...newImagePreviews,
      ]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);

    const updatedPreviews = [...imagePreviews];
    updatedPreviews.splice(index, 1);
    setImagePreviews(updatedPreviews);
  };

  const handleCloseModal = () => {
    setQuestion("");
    setImages([]);
    setImagePreviews([]);
    onClose();
  };

  const handleSubmit = () => {
    postQuestion();
  };

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
      <Modal isOpen={isOpen} onClose={handleCloseModal} onOpenChange={onOpenChange} placement="top-center">
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
                 <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
            />
             <div
              className="image-previews"
              style={{ display: "flex", flexWrap: "wrap" }}
            >
              {imagePreviews.map(({ url }, index) => (
                <div
                  className="image-preview"
                  key={index}
                  style={{
                    position: "relative",
                    width: "100px",
                    height: "100px",
                    margin: "5px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={url}
                    alt={`Preview ${index}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    style={{
                      position: "absolute",
                      top: "5px",
                      right: "5px",
                      background: "rgba(0, 0, 0, 0.5)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
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
