import React, { useState } from "react";
import html2canvas from "html2canvas";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
} from "react-bootstrap";
import "./Editor.css";
import Draggable from "react-draggable";
import { FiUpload } from "react-icons/fi";
import { ProductList, IMAGES, BOUNDS } from "./editorConstant/EditorConstant";
import hor from "./img/horizontal-align-center.png";
import ver from "./img/vertical-align-center.webp";

const Editor = () => {
  const [imageIndex, setimageIndex] = useState(0);
  const [expandedCard, setExpandedCard] = useState(null);
  const [expandedCardRow, setExpandedCardRow] = useState(null);
  const [expandedCardRowItem, setExpandedCardRowItem] = useState(null);
  const [chunkedCardsList, setChunkedCardsList] = useState([]);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
  //Imgae Uploading Functions ///
  const [imageSrc, setImageSrc] = useState(null);
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      setImageSrc(event.target.result);
      setChunkedCardsList(ProductList(event.target.result));
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };
  const handleButtonClick = () => {
    document.getElementById("fileInput").click();
  };
  //Imgae Uploading Functions /////Imgae Uploading Functions ///

  /////
  const box1Width = 500;
  const box1Height = 500;
  const box2Width = 400;
  const box2Height = 400;

  const adjustedWidth1 = (box1Width * expandedCard?.sliderValue) / 100;
  const adjustedHeight1 = (box1Height * expandedCard?.sliderValue) / 100;
  const adjustedWidth2 = (box2Width * 5) / 100;
  const adjustedHeight2 = (box2Height * 5) / 105;

  const box1ImageStyle = {
    width: adjustedWidth1,
    height: adjustedHeight1,
    position: "absolute",
    top: (box1Height - adjustedHeight1) / 2,
    left: (box1Width - adjustedWidth1) / 2,
  };

  const box2ImageStyle = {
    width: adjustedWidth2,
    height: adjustedHeight2,
    position: "absolute",
    top: (box2Height - adjustedHeight2) / 2,
    left: (box2Width - adjustedWidth2) / 2,
  };
  /////////

  ///Editor Hnadlers
  const handleCardClick = (card, row, item) => {
    setimageIndex(0);
    setExpandedCard(card);
    setExpandedCardRow(row);
    setExpandedCardRowItem(item);
    console.log(card, row, item);
  };
  const handleDrag = (e, ui, index) => {
    setExpandedCard((prevState) => ({
      ...prevState,
      position: {
        x: prevState.position.x + ui.deltaX,
        y: prevState.position.y + ui.deltaY,
      },
    }));
    console.log("fucking position", {
      x: expandedCard.position.x + ui.deltaX,
      y: expandedCard.position.y + ui.deltaY,
    });
  };

  const handleSlider = (value) => {
    setExpandedCard((prevState) => ({
      ...prevState,
      sliderValue: value,
    }));
  };
  const updatePosition = (type, index) => {
    console.log(type, index);
    setExpandedCard((prevState) => ({
      ...prevState,
      position: expandedCard.vertical,
    }));
  };
  const ApplyChnages = async () => {
    console.log("expanded card", expandedCard);
    let image = await captureAndConvertToBase64();
    console.log("afssgfdg", image);
    await updateEditedSetting(
      expandedCardRow,
      expandedCardRowItem,
      expandedCard,
      image
    );
    setExpandedCardRow(null);
    setExpandedCard(null);
  };
  const captureAndConvertToBase64 = async () => {
    const divToCapture = document.getElementById("divId");
    const canvas = await html2canvas(divToCapture);
    const base64Image = canvas.toDataURL();
    console.log(base64Image);
    return base64Image;
  };
  const updateEditedSetting = (chunkIndex, elementIndex, newValue, image) => {
    if (chunkIndex < 0 || chunkIndex >= chunkedCardsList.length) {
      console.error("Invalid chunkIndex:", chunkIndex);
      return;
    }
    const chunk = chunkedCardsList[chunkIndex];
    if (
      !Array.isArray(chunk) ||
      elementIndex < 0 ||
      elementIndex >= chunk.length
    ) {
      console.error("Invalid elementIndex:", elementIndex);
      return;
    }
    const updatedChunkedCards = [...chunkedCardsList];
    updatedChunkedCards[chunkIndex][elementIndex].EditedSetting = newValue;
    updatedChunkedCards[chunkIndex][elementIndex].EditedImage = image;
    setChunkedCardsList(updatedChunkedCards);
  };

  const [viewVisibilty, setViewVisibilty] = useState("public");
  const [selectedOption, setSelectedOption] = useState("no");

  const [isChecked, setIsChecked] = useState(false);
  const handleSubmit = () => {
    let obj = {
      title: title,
      tags: tags,
      description: description,
      iewVisibilty: viewVisibilty,
      consent: selectedOption,
      agreement: isChecked,
      list: chunkedCardsList,
    };
    const emptyFields = Object.keys(obj).filter((key) => {
      return (
        obj[key] === false ||
        obj[key] === "" ||
        obj[key] === null ||
        obj[key] === undefined ||
        (Array.isArray(obj[key]) && obj[key].length === 0)
      );
    });
    if (emptyFields.length > 0) {
      alert(`Please fill in the following fields: ${emptyFields.join(", ")}`);
    } else {
      console.log(chunkedCardsList);
    }
  };

  const DisableSetting = (chunkIndex, elementIndex) => {
    if (chunkIndex < 0 || chunkIndex >= chunkedCardsList.length) {
      console.error("Invalid chunkIndex:", chunkIndex);
      return;
    }
    const chunk = chunkedCardsList[chunkIndex];
    if (
      !Array.isArray(chunk) ||
      elementIndex < 0 ||
      elementIndex >= chunk.length
    ) {
      console.error("Invalid elementIndex:", elementIndex);
      return;
    }
    const updatedChunkedCards = [...chunkedCardsList];
    const element = updatedChunkedCards[chunkIndex][elementIndex];
    element.disable = !element.disable;
    setChunkedCardsList(updatedChunkedCards);
  };

  return (
    <Container fluid>
      <Row className="d-flex justify-content-center">
        <Col className="text-center" lg={6} md={6}>
          <div style={{ cursor: "pointer" }} onClick={handleButtonClick}>
            <Card className="mt-3">
              <Card.Body>
                <div className="flex justify-center">
                  <span className="text-danger display-1">
                    {" "}
                    <FiUpload />
                    <input
                      className=""
                      id="fileInput"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleImageUpload}
                    />
                  </span>
                </div>
              </Card.Body>
            </Card>
            <h4>File requirements</h4>
            <h6>What is this?</h6>
            <p>
              {" "}
              We recommend high-resolution JPEG, PNG or GIF files with a minimum
              of 1000px resolution. For more help, check out our design guide
            </p>
          </div>
        </Col>
      </Row>
      {imageSrc && (
        <>
          <Row className="d-flex justify-content-center mb-5">
            <Col lg={4} md={6}>
              <Card className="rounded-0 text-center ">
                <Card.Img
                  width={400}
                  height={400}
                  src={imageSrc}
                  alt="uploadimage"
                />
              </Card>
            </Col>
            <Col lg={6} md={6}>
              <Form>
                <Form.Group className="mb-2" controlId="title">
                  <Form.Label className="h3 mb-2">Title (required)</Form.Label>

                  <Form.Control
                    type="text"
                    placeholder="Enter a descriptive title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                  <Form.Text className="text-muted">
                    Use a descriptive title that explains your work in 4-8
                    words.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-2" controlId="tags">
                  <Form.Label className="h3 mb-2">Tags</Form.Label>

                  <Form.Control
                    type="text"
                    placeholder="Enter tags separated by commas"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                  <Form.Text className="text-muted">
                    Write up to 15 tags (50 character limit per tag) separated
                    by commas, that describe the content of your art.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-2" controlId="description">
                  <Form.Label className="h3 mb-2">Description</Form.Label>

                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Example: Drawing I did while camping at the national park."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <Form.Text className="text-muted">
                    Share the story or meaning behind your work.
                  </Form.Text>
                </Form.Group>
              </Form>
            </Col>
          </Row>
          <Row>
            <Alert
              className="rounded-0 w-100 text-center"
              key="dark"
              variant="dark"
            >
              <h4> Product Previews</h4>
            </Alert>
          </Row>
          <Row>
            <div>
              {chunkedCardsList.map((row, rowIndex) => (
                <React.Fragment key={rowIndex}>
                  <Row xs={1} md={3}>
                    {row.map((item, index) => (
                      <Col key={index}>
                        <Card className="mx-3 rounded-0 mb-2 border-0">
                          <Card.Body>
                            {item.EditedImage ? (
                              <div
                                style={{
                                  backgroundImage: `url(${item.EditedImage})`,
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                  width: 350,
                                  height: box2Height,
                                }}
                              ></div>
                            ) : (
                              <div
                                className={item.disable && "disable-card"}
                                style={{
                                  backgroundColor: "gray",
                                  backgroundImage: `url(${IMAGES[item.Image]})`,
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                  width: box2Width,
                                  height: box2Height,
                                  position: "relative",
                                  userSelect: "none",
                                }}
                              >
                                <div
                                  style={{
                                    borderRadius: "100PX",
                                    marginTop: "138px",
                                    marginLeft: "68px",

                                    width: "260px",
                                    height: "260px",
                                    position: "absolute",
                                  }}
                                >
                                  <Draggable
                                    bounds="parent"
                                    position={{ x: -70, y: -150 }}
                                  >
                                    <img
                                      style={box2ImageStyle}
                                      src={imageSrc}
                                      alt="Img"
                                      className="box"
                                    />
                                  </Draggable>
                                </div>
                              </div>
                            )}
                          </Card.Body>
                        </Card>
                        <div className="justify-content-center d-flex mx-3 mb-3">
                          <Button
                            className="w-50 mx-2"
                            variant="success"
                            disabled={item.disable}
                            onClick={() =>
                              handleCardClick(
                                item.EditedSetting ? item.EditedSetting : item,
                                rowIndex,
                                index
                              )
                            }
                          >
                            Edit
                          </Button>

                          <Button
                            variant={item.disable ? "secondary" : "warning"}
                            className="w-50 mx-2"
                            onClick={() => DisableSetting(rowIndex, index)}
                          >
                            {item.disable ? "Disabled" : " Disable"}
                          </Button>
                        </div>
                      </Col>
                    ))}
                  </Row>

                  {expandedCard && expandedCardRow === rowIndex && (
                    <Container>
                      <Card bg="light" className="mt-3 expanded-card">
                        <Card.Body>
                          <Row key={`expanded-${rowIndex}`} className="mb-2">
                            <Col xs={6}>
                              <div
                                id="divId"
                                className="f-x"
                                style={{
                                  backgroundImage: `url(${
                                    IMAGES[expandedCard.boundImage[imageIndex]]
                                  })`,
                                  backgroundSize: "cover",
                                  backgroundPosition: "center",
                                  width: box1Width,
                                  height: box1Height,
                                  position: "relative",
                                }}
                              >
                                <div style={BOUNDS[expandedCard.bounds]}>
                                  <Draggable
                                    bounds="parent"
                                    onDrag={(e, ui) =>
                                      handleDrag(e, ui, expandedCard.uniques)
                                    }
                                    position={expandedCard.position}
                                  >
                                    <img
                                      style={box1ImageStyle}
                                      src={imageSrc}
                                      alt="badge"
                                      className="box"
                                    />
                                  </Draggable>
                                </div>
                              </div>
                            </Col>
                            <Col lg={6}>
                              <Card>
                                <Card.Body>
                                  <Form.Label className="mt-0 h6">
                                    Range
                                  </Form.Label>
                                  <div className="text-center">
                                    <br />
                                    <Form.Range
                                      id="width"
                                      className="w-100 rounded-0"
                                      min="1"
                                      max="30"
                                      step={1}
                                      value={expandedCard.sliderValue}
                                      onChange={(e) =>
                                        handleSlider(e.target.value)
                                      }
                                    />
                                    <span className="pb-5">
                                      {" "}
                                      {Math.round(
                                        expandedCard.sliderValue / 0.3
                                      )}
                                      %
                                    </span>
                                  </div>

                                  <div className="mt-2">
                                    {expandedCard.ListImage && (
                                      <div className="mb-3">
                                        <Form.Label className="mt-0 h6">
                                          Select Variation
                                        </Form.Label>
                                        <Form.Select
                                          value={imageIndex}
                                          onChange={(e) =>
                                            setimageIndex(e.target.value)
                                          }
                                          aria-label="Default select example"
                                        >
                                          {expandedCard.ListImage?.map(
                                            (image, index) => (
                                              <option key={index} value={index}>
                                                {image}
                                              </option>
                                            )
                                          )}
                                        </Form.Select>
                                      </div>
                                    )}

                                    <h6>Center Design:</h6>
                                    <div className="d-flex justify-content-between">
                                      <Button
                                        onClick={() =>
                                          updatePosition(
                                            "verticall",
                                            expandedCard.uniques
                                          )
                                        }
                                        variant="dark"
                                        className=" me-2 w-50 "
                                        size="sm"
                                        //   onClick={changeVerticle}
                                      >
                                        <img
                                          width={30}
                                          height={30}
                                          alt="aling"
                                          src={ver}
                                          className="mx-2"
                                        />
                                        Vertically
                                      </Button>

                                      <Button
                                        onClick={() =>
                                          updatePosition(
                                            "horizontal",
                                            expandedCard.uniques
                                          )
                                        }
                                        variant="dark"
                                        className="w-50"
                                        size="sm"
                                      >
                                        <img
                                          width={30}
                                          height={30}
                                          alt="aling"
                                          src={hor}
                                          className="mx-2"
                                        />{" "}
                                        Horizontally
                                      </Button>
                                    </div>
                                  </div>
                                  <div className="text-center">
                                    <p className="uploader-info fw-bolder">
                                      Print size: 2400×3200px
                                    </p>
                                  </div>

                                  <div
                                    className="w-100"
                                    style={{ marginTop: "70px" }}
                                  >
                                    <Button
                                      onClick={ApplyChnages}
                                      variant="danger"
                                      className="me-2 w-100 rounded-0"
                                      size="sm"
                                    >
                                      Apply Changes
                                    </Button>
                                  </div>
                                </Card.Body>
                              </Card>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Container>
                  )}
                </React.Fragment>
              ))}
            </div>
          </Row>
          <Row>
            <hr />
            <Col lg={3} md={12}>
              <Card className="border-0 rounded-0">
                <Card.Body>
                  <div>
                    <label htmlFor="visibility">
                      {" "}
                      <h4> Who can view this work?</h4>{" "}
                    </label>
                    <Form.Select
                      id="visibility"
                      value={viewVisibilty}
                      onChange={(event) => setViewVisibilty(event.target.value)}
                    >
                      <option value="public">Anybody (public)</option>
                      <option value="private">Only You (private)</option>
                    </Form.Select>
                    <p className="mt-3">
                      Selected option:{" "}
                      <Button variant="dark">
                        {" "}
                        {viewVisibilty === "public"
                          ? "Anybody (public)"
                          : "Only You (private)"}
                      </Button>
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={9} md={12}>
              <Card className="border-0 rounded-0">
                <Card.Body>
                  {" "}
                  <div>
                    <label className="h4">Is this mature content?</label>
                    <p className="mb-0">
                      Nudity or lingerie, adult language, alcohol or drugs,
                      blood, guns or violence. Not sure? See guidelines.
                    </p>
                    <div>
                      <input
                        type="radio"
                        id="yes"
                        name="matureContent"
                        value="yes"
                        checked={selectedOption === "yes"}
                        onChange={(event) =>
                          setSelectedOption(event.target.value)
                        }
                      />
                      <label htmlFor="yes">Yes</label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        id="no"
                        name="matureContent"
                        value="no"
                        checked={selectedOption === "no"}
                        onChange={(event) =>
                          setSelectedOption(event.target.value)
                        }
                      />
                      <label htmlFor="no">No</label>
                    </div>
                  </div>
                  <hr />
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <hr />
              <label>
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(event) => setIsChecked(event.target.checked)}
                />
                I agree to the Redbubble User Agreement, and I confirm that I
                have the right to sell products containing this artwork,
                including (1) any featured company's name or logo, (2) any
                featured person's name or face, and (3) any feature words or
                images created by someone else
              </label>
              <hr />
              <div className="text-center mb-5">
                <Button className="w-50" onClick={handleSubmit}>
                  Save Changes
                </Button>
              </div>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default Editor;
