"use client";

import React from 'react';
import GoogleMapsStreetView from './googleMapsStreetView';
import { styled } from 'styled-components';

// Add global styles
const GlobalStyle = styled.createGlobalStyle`
  body,
  html {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
`;

// Add CSS for the container
const Container = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
`;

// Main page component
export default function Page() {
  return (
    <>
      <Container>
        <GoogleMapsStreetView />
      </Container>
      <GlobalStyle />
    </>
  );
} 