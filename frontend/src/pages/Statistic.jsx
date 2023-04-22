import { useRef, useState } from "react";
import { FaChartLine } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { Form, Row, Col, FloatingLabel, Table } from "react-bootstrap";
import { toast } from "react-toastify";

const Statistic = () => {
  const avgBookingNameRef = useRef(null);
  const avgBookingNdaysRef = useRef(null);

  const [avgBooking, setAvgBooking] = useState(null);

  // Queries
  const {
    data: dataCampground,
    isLoading: isLoadingCampground,
    isError: isErrorCampground,
  } = useQuery({
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

  console.log(dataCampground);

  const getAvgBooking = async () => {
    const id = avgBookingNameRef.current.value;
    const nDays = avgBookingNdaysRef.current.value;
    if (!id) return toast.error("Please select campground");
    if (!nDays) return toast.error("Please fill last n days");
    await fetch(
      process.env.REACT_APP_BACKEND_URI +
        `/api/v5/campgrounds/${id}/status/average/${nDays}`
    )
      .then((res) => {
        if (res.ok) return res.json();
        else return null;
      })
      .then((res) => setAvgBooking(res));
  };

  return (
    <>
      <section className="heading text-center mb-4">
        <h1>
          <FaChartLine />
          &nbsp;Statistics
        </h1>
      </section>
      <section className="form">
        <h5 className="mb-3">
          <u>Booking average in last n days</u>
        </h5>
        {isErrorCampground && <>failed to load data</>}
        {isLoadingCampground ? (
          <>Loading...</>
        ) : (
          <>
            <Row>
              <Col md={8} className="mb-3">
                <FloatingLabel
                  controlId="floatingSelect"
                  label="Campground Name"
                >
                  <Form.Select
                    aria-label="Floating label select campground"
                    defaultValue={""}
                    ref={avgBookingNameRef}
                  >
                    <option value="">Please select campground</option>
                    {dataCampground?.map((e) => {
                      return (
                        <option key={e.id} value={e?.id}>
                          {e?.name}
                        </option>
                      );
                    })}
                  </Form.Select>
                </FloatingLabel>
              </Col>
              <Col md={4} className="mb-3">
                <FloatingLabel
                  controlId="floatingInput"
                  label="Last n days"
                  className="mb-3"
                >
                  <Form.Control
                    ref={avgBookingNdaysRef}
                    type="number"
                    min={1}
                    max={100}
                  />
                </FloatingLabel>
              </Col>
              <div className="form-group mb-4">
                <button
                  className="btn btn-block w-100"
                  type="button"
                  onClick={getAvgBooking}
                >
                  Show average
                </button>
              </div>
              {avgBooking ? (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      {/* <th>Campground Name</th> */}
                      <th>Booking Number</th>
                      <th>Average</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{avgBooking?.bookingNumber}</td>
                      <td>{avgBooking?.average.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </Table>
              ) : (
                <div className="text-center">Empty</div>
              )}
            </Row>
          </>
        )}
      </section>
    </>
  );
};

export default Statistic;
