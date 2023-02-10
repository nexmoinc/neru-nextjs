import React, { ChangeEvent, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

interface AddClientProps {
  show: boolean;
  handleClose: () => void;
  handleSave: (APIKey: string) => void;
}

export const AddClient = ({
  show,
  handleClose,
  handleSave,
}: AddClientProps) => {
  const [APIKey, setAPIKey] = useState("");

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>New client</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="addClientForm.APIKey">
            <Form.Label>Client API key</Form.Label>
            <Form.Control
              type="string"
              placeholder="API key"
              autoFocus
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setAPIKey(e.currentTarget.value)
              }
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={() => handleSave(APIKey)}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
