import { FaBook } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { Form, Row, Col, FloatingLabel } from "react-bootstrap";

const Statistic = () => {
  // Queries
  const { data, isLoading, isError } = useQuery({
    queryKey: ["campgrounds"],
    queryFn: async () => {
      const response = await fetch(
        process.env.REACT_APP_BACKEND_URI + "/api/v5/campgrounds",
        {
          credentials: "include",
        }
      )
        .then((res) => res.json())
        .then((res) => {
          return res.data;
        });
      return response;
    },
  });

  console.log(data);

  return (
    <>
      <section className="heading text-center mb-4">
        <h1>
          <FaBook />
          &nbsp;Statistics
        </h1>
      </section>
      {isError && <>failed to load data</>}
      {isLoading ? (
        <>Loading...</>
      ) : (
        <>
          <section className="form">
            <Row>
              <Col md={8}>
                <FloatingLabel
                  controlId="floatingSelect"
                  label="Campground Name"
                >
                  <Form.Select
                    aria-label="Floating label select campground"
                    defaultValue={""}
                  >
                    <option value="">Please select campground</option>
                    {data.map((e) => {
                      return (
                        <option key={e.id} value={e?.name}>
                          {e?.name}
                        </option>
                      );
                    })}
                  </Form.Select>
                </FloatingLabel>
              </Col>
              <Col md={4}>
                <FloatingLabel
                  controlId="floatingInput"
                  label="Last n days"
                  className="mb-3"
                >
                  <Form.Control type="number" min={1} max={100} />
                </FloatingLabel>
              </Col>
              <div className="form-group mb-4">
                <button className="btn btn-block w-100">Show average</button>
              </div>
            </Row>
          </section>
        </>
      )}
    </>
  );
};

export default Statistic;
