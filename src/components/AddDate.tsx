import React, { ChangeEvent, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";

interface AddClientProps {
  apiKeys: Array<string | number>;
  show: boolean;
  handleClose: () => void;
  handleSave: (apiKey: string, date: string, quota: number) => void;
}

export const AddDate = ({
  show,
  handleClose,
  handleSave,
  apiKeys,
}: AddClientProps) => {
  const [alerts, setAlerts] = useState<Array<string>>([]);
  const [APIKey, setAPIKey] = useState("");
  const [date, setDate] = useState("");
  const [quota, setQuota] = useState(0);

  const onClose = () => {
    setAlerts([]);
    setAPIKey("");
    setDate("");
    setQuota(0);
    handleClose();
  };

  const onSave = () => {
    const errorMessages = [];

    if (!APIKey) {
      errorMessages.push("API key is missing");
    }

    if (!date || !/^([0-9]{4})\-([0-9]{2})\-([0-9]{2})$/.test(date)) {
      errorMessages.push("Date is invalid");
    }

    if (!Number.isInteger(quota) || quota === 0) {
      errorMessages.push("Quota is missing or not a number");
    }

    if (errorMessages.length) {
      setAlerts(errorMessages);
    } else {
      handleSave(APIKey, date, quota);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>New date</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {alerts.length > 0 && (
          <Alert variant="danger">
            {alerts.map((alert) => (
              <li key={alert}>{alert}</li>
            ))}
          </Alert>
        )}
        <Form>
          <Form.Group className="mb-3" controlId="addDateForm.Date">
            <Form.Label>Client API key</Form.Label>
            <Form.Select
              aria-label="Client API key"
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setAPIKey(e.currentTarget.value)
              }
            >
              <option key="">Choose Client API key</option>
              {apiKeys.map((key) => (
                <option key={key}>{key}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="addDateForm.Date">
            <Form.Label>Day</Form.Label>
            <Form.Control
              type="date"
              autoFocus
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setDate(e.currentTarget.value)
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="addDateForm.Quota">
            <Form.Label>Quota</Form.Label>
            <Form.Control
              type="string"
              placeholder="ex: 1000"
              autoFocus
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setQuota(parseInt(e.currentTarget.value, 10))
              }
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={onSave}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
