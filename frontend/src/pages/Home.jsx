import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { FaSignInAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Form, FloatingLabel, Row, Col, Card, Badge } from "react-bootstrap";
import { toast } from "react-toastify";

function Home() {
  const { user } = useSelector((state) => state.auth);

  const [recommendData, setRecommendData] = useState(null);

  const startDateRef = useRef(null);
  const endDateRef = useRef(null);
  const nightsRef = useRef(null);

  const handleSearch = async () => {
    const startDate = startDateRef.current.value;
    const endDate = endDateRef.current.value;
    const nights = nightsRef.current.value;

    if (!startDate) return toast.error("Please select start date");
    if (!endDate) return toast.error("Please select end date");
    if (startDate > endDate) return toast.error("Please select valid date");

    await fetch(
      process.env.REACT_APP_BACKEND_URI +
        `/api/v5/campgrounds/recommendation/?period_start=${startDate}&period_end=${endDate}&night=${nights}`
    )
      .then((res) => res.json())
      .then((res) => {
        setRecommendData(res.recommended);
      });
  };

  const UTCtoDate = (date) => {
    const ndate = new Date(date);
    return (
      (ndate.getMonth() > 8
        ? ndate.getMonth() + 1
        : "0" + (ndate.getMonth() + 1)) +
      "/" +
      (ndate.getDate() > 9 ? ndate.getDate() : "0" + ndate.getDate()) +
      "/" +
      ndate.getFullYear()
    );
  };

  return (
    <>
      <div className="d-flex justify-content-center align-items-center">
        <div className="w-100">
          <section className={``}>
            <h1 className="text-center">A Campground Booking System</h1>
          </section>

          {!user ? (
            <div>
              <Link to="/login" className="btn btn-block">
                <FaSignInAlt />
                &nbsp;Login
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center">
                <div className="mb-3">Welcome, {user.name}</div>
              </div>
              <section className="form">
                <div className="mb-2">
                  <b>Recommend</b>
                </div>
                <Row>
                  <Col xs={12} lg={5}>
                    <FloatingLabel
                      controlId="start_date"
                      label="Start date"
                      className="mb-3"
                    >
                      <Form.Control ref={startDateRef} type="date" />
                    </FloatingLabel>
                  </Col>
                  <Col xs={12} lg={5}>
                    <FloatingLabel
                      controlId="end_date"
                      label="End date"
                      className="mb-3"
                    >
                      <Form.Control ref={endDateRef} type="date" />
                    </FloatingLabel>
                  </Col>
                  <Col xs={12} lg={2}>
                    <FloatingLabel
                      controlId="night"
                      label="Nights"
                      className="mb-3"
                    >
                      <Form.Control
                        ref={nightsRef}
                        type="number"
                        defaultValue={0}
                        min={0}
                        max={3}
                      />
                    </FloatingLabel>
                  </Col>
                </Row>
                <button
                  type="button"
                  className="btn w-100 mb-3"
                  onClick={handleSearch}
                >
                  Search
                </button>

                {recommendData?.map((c) => {
                  return (
                    <Col xs={12} className="mb-3">
                      <Card>
                        <Card.Header>{c?.name}</Card.Header>
                        <Card.Body>
                          <div>
                            <b>Address</b>: {c?.address}
                          </div>
                          <div>
                            <b>Tel</b>: {c?.tel}
                          </div>
                          <div>
                            <b>Capacity</b>: {c?.capacity}
                          </div>
                          <div>
                            <b>Available date</b>:&nbsp;
                            {c.availableDays.map((d) => {
                              const fromDate = UTCtoDate(d?.fromDate);
                              const toDate = UTCtoDate(d?.toDate);

                              return (
                                <>
                                  <Badge pill bg="dark" className="me-2">
                                    {fromDate} - {toDate}
                                  </Badge>
                                </>
                              );
                            })}
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </section>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
