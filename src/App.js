import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/ConnectBlockchain";
import { fetchData } from "./redux/data/dataConnect";
import * as s from "./styles/globalStyles";
import styled from "styled-components";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 30px;
  border-radius: 50px;
  border: none;
  background-color: white;
  font-weight: bold;
  color: black;
  width: 140px;
  cursor: pointer;
  font-size: 15px;
  text-align:center;
 
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Cliquer sur le bouton Acheter pour mint des NFT`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`En train de minter votre ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(blockchain.account, mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Désolé, problème technique, essayer plus tard.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `Vous pouvez désormais voir vos NFTs sur Opensea.io en cliquant sur le bouton opensea`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementerMint = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementerMint = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 50) {
      newMintAmount = 50;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen>
      <s.Titre
        style={{
          textAlign: "center",
          color: "black",
        }}
      >
        MINTER VOS PROPRES NFT
      </s.Titre>
      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: 10, backgroundColor: "#D3D1D0" }}
      >
        <span
          style={{
            textAlign: "center",
          }}
        >
          <s.Text
            style={{
              textAlign: "center",
              fontSize: 30,
              fontWeight: "bold",
              color: "var(--accent-text)",
            }}
          >
            <u>  TOTAL COLLECTIONS </u>: <br></br> {data.totalSupply} / {CONFIG.MAX_SUPPLY}
          </s.Text>
          <StyledButton
            style={{
              marginLeft: "1100px",
              marginTop: "-500px",
            }}
            onClick={(e) => {
              window.open(CONFIG.MARKETPLACE_LINK, "_blank");
            }}
          >
            {CONFIG.MARKETPLACE}
          </StyledButton>
        </span>

        <s.trois />
        <ResponsiveWrapper flex={1} style={{ padding: -10 }} test>

          <s.un />
          <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "grey",
              padding: 2,
              borderRadius: 24,
              boxShadow: "0px 0px 0px 0px rgba(0,0,0,0)",
            }}
          >

            <s.description
              style={{
                textAlign: "center",
                color: "var(--primary-text)",
              }}
            >

            </s.description>

            <s.trois />
            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.Text
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  The sale has ended.
                </s.Text>
                <s.description
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  Vous pouvez trouver {CONFIG.NFT_NAME} sur
                </s.description>
                <s.trois />
                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </StyledLink>
              </>
            ) : (
              <>
                <s.Text
                  style={{ textAlign: "center", color: "BLUE" }}
                >
                  1 {CONFIG.SYMBOL} coûte {CONFIG.DISPLAY_COST}{" "}
                  {CONFIG.NETWORK.SYMBOL}.
                </s.Text>

                <s.SpacerXSmall />

                <s.trois />
                {blockchain.account === "" ||
                  blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.description
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      Se connecter au réseau " {CONFIG.NETWORK.NAME} "
                    </s.description>
                    <s.trois />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      SE CONNECTER
                    </StyledButton>
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.trois />
                        <s.description
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.description>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <>
                    <s.description
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      {feedback}
                    </s.description>
                    <s.deux />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledButton
                        style={{ lineHeight: 0.4 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          decrementerMint();
                        }}
                      >
                        -
                      </StyledButton>
                      <s.deux />
                      <s.description
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        {mintAmount}
                      </s.description>
                      <s.deux />
                      <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          incrementerMint();
                        }}
                      >
                        +
                      </StyledButton>
                    </s.Container>
                    <s.trois />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs();
                          getData();
                        }}
                      >
                        {claimingNft ? "ATTENDEZ" : "ACHETER"}
                      </StyledButton>
                    </s.Container>
                  </>
                )}
              </>
            )}
            <s.deux />
          </s.Container>
          <s.un />

        </ResponsiveWrapper>
        <s.deux />
        <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>

          <s.trois />

        </s.Container>
      </s.Container>
    </s.Screen>
  );
}

export default App;
