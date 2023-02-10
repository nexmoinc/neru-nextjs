import { useState } from "react";
import { QuotasTable } from "../components/QuotasTable";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import { convertData } from "../utils/convert-data";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import useSWR from "swr";
import { AddClient } from "@/components/AddClient";
import { AddDate } from "@/components/AddDate";

const fetcher = (input: RequestInfo, init?: RequestInit) =>
  fetch(input, init).then((res) => res.json());

const saveQuota = async (APIKey: string, date: string, quota: number) =>
  await fetcher(`/api/keys/${APIKey}/quota`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      date,
      quota,
    }),
  });

const QuotaManager = () => {
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "warning";
  } | null>();
  const [showAddDateModal, setShowAddDateModal] = useState(false);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const { data: response, error, mutate } = useSWR("/api/keys", fetcher);

  const handleAddClient = async (APIKey: string) => {
    await fetcher(`/api/keys/${APIKey}`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });

    mutate();
    setShowAddClientModal(false);
    setMessage({
      text: `New client API added: <strong>${APIKey}</strong>`,
      type: "success",
    });
  };

  const handleAddDate = async (APIKey: string, date: string, quota: number) => {
    await saveQuota(APIKey, date, quota);
    mutate();
    setShowAddDateModal(false);
    setMessage({
      text: `New date added for client <strong>${APIKey}</strong>. Quota is set to <strong>${quota}</strong> on <strong>${date}</strong>.`,
      type: "success",
    });
  };

  const updateQuota = async (APIKey: string, date: string, quota: number) => {
    if (Number.isInteger(quota)) {
      await saveQuota(APIKey, date, quota);
      mutate();

      setMessage({
        text: `Quota updated for <strong>${APIKey}</strong> on <strong>${date}</strong> with value of <strong>${quota}</strong>.`,
        type: "success",
      });
    } else {
      setMessage({ text: "Quota is invalid", type: "warning" });
    }
  };

  if (error) return <div>Failed to load</div>;
  if (!response) return <div>Loading...</div>;

  const { columns, data } = convertData(response.result);

  return (
    <Container>
      <Row className="mt-5 mb-3">
        <Col sm={4} className="ms-auto text-end">
          <Button variant="primary" onClick={() => setShowAddDateModal(true)}>
            Add day
          </Button>
        </Col>
      </Row>

      <QuotasTable columns={columns} data={data} updateQuota={updateQuota} />

      <Row mt={2}>
        <Col sm={3}>
          <Button variant="primary" onClick={() => setShowAddClientModal(true)}>
            Add client
          </Button>
        </Col>
        <Col>
          {message ? (
            <div
              className={`alert alert-${message.type} alert-dismissible fade show py-2`}
              role="alert"
            >
              <span dangerouslySetInnerHTML={{ __html: message.text }} />
              <button
                onClick={() => setMessage(null)}
                type="button"
                className="btn-close pt-1"
                data-bs-dismiss="alert"
                aria-label="Close"
              />
            </div>
          ) : null}
        </Col>
      </Row>
      <AddClient
        show={showAddClientModal}
        handleSave={handleAddClient}
        handleClose={() => setShowAddClientModal(false)}
      />
      <AddDate
        apiKeys={data.map(({ api_key }) => api_key)}
        show={showAddDateModal}
        handleSave={handleAddDate}
        handleClose={() => setShowAddDateModal(false)}
      />
    </Container>
  );
};

export default QuotaManager;
