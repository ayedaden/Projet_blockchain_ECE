import styled from "styled-components";

export const Screen = styled.div`
  background-color: var(--primary);
  background-image: ${({ image }) => (image ? `url(${image})` : "none")};
  background-size: cover;
  background-position: center;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const SpacerXSmall = styled.div`
  height: 10px;
  width: 10px;
`;

export const trois = styled.div`
  height: 5px;
  width: 5px;
`;

export const deux = styled.div`
  height: 15px;
  width: 15px;
`;

export const un = styled.div`
  height: 100px;
  width: 100px;
`;
export const Container = styled.div`
  display: flex;
  flex: ${({ flex }) => (flex ? flex : 0)};
  flex-direction: ${({ fd }) => (fd ? fd : "column")};
  justify-content: ${({ jc }) => (jc ? jc : "flex-start")};
  align-items: ${({ ai }) => (ai ? ai : "flex-start")};
  width: 100%;
`;
export const Titre = styled.p`
  font-size: 40px;
  padding-top: 10px;
`;

export const Text = styled.p`
  color: var(--primary-text);
  font-size: 22px;
  font-weight: 500;
  line-height: 1.6;
`;

export const soustitre = styled.p`
  color: var(--primary-text);
  font-size: 18px;
  line-height: 1.6;
`;

export const description = styled.p`
  color: var(--primary-text);
  font-size: 40px;
  line-height: 1.6;
`;

