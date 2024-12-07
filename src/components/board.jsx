import React, { useState } from "react";

// Import piece images
import BlackRook from "../assets/pieces/bR.svg";
import BlackKnight from "../assets/pieces/bN.svg";
import BlackBishop from "../assets/pieces/bB.svg";
import BlackQueen from "../assets/pieces/bQ.svg";
import BlackKing from "../assets/pieces/bK.svg";
import BlackPawn from "../assets/pieces/bP.svg";
import WhiteRook from "../assets/pieces/wR.svg";
import WhiteKnight from "../assets/pieces/wN.svg";
import WhiteBishop from "../assets/pieces/wB.svg";
import WhiteQueen from "../assets/pieces/wQ.svg";
import WhiteKing from "../assets/pieces/wK.svg";
import WhitePawn from "../assets/pieces/wP.svg";

// Helper function to check if a position is within the board
const isInBounds = (index) => index >= 0 && index < 64;

export const Board = () => {
  const [pieces, setPieces] = useState([
    { color: "black", name: "Rook", imgSrc: BlackRook },
    { color: "black", name: "Knight", imgSrc: BlackKnight },
    { color: "black", name: "Bishop", imgSrc: BlackBishop },
    { color: "black", name: "Queen", imgSrc: BlackQueen },
    { color: "black", name: "King", imgSrc: BlackKing },
    { color: "black", name: "Bishop", imgSrc: BlackBishop },
    { color: "black", name: "Knight", imgSrc: BlackKnight },
    { color: "black", name: "Rook", imgSrc: BlackRook },
    { color: "black", name: "Pawn", imgSrc: BlackPawn },
    { color: "black", name: "Pawn", imgSrc: BlackPawn },
    { color: "black", name: "Pawn", imgSrc: BlackPawn },
    { color: "black", name: "Pawn", imgSrc: BlackPawn },
    { color: "black", name: "Pawn", imgSrc: BlackPawn },
    { color: "black", name: "Pawn", imgSrc: BlackPawn },
    { color: "black", name: "Pawn", imgSrc: BlackPawn },
    { color: "black", name: "Pawn", imgSrc: BlackPawn },
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null, // Row 3
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null, // Row 4
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null, // Row 5
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null, // Row 6
    { color: "white", name: "Pawn", imgSrc: WhitePawn },
    { color: "white", name: "Pawn", imgSrc: WhitePawn },
    { color: "white", name: "Pawn", imgSrc: WhitePawn },
    { color: "white", name: "Pawn", imgSrc: WhitePawn },
    { color: "white", name: "Pawn", imgSrc: WhitePawn },
    { color: "white", name: "Pawn", imgSrc: WhitePawn },
    { color: "white", name: "Pawn", imgSrc: WhitePawn },
    { color: "white", name: "Pawn", imgSrc: WhitePawn },
    { color: "white", name: "Rook", imgSrc: WhiteRook },
    { color: "white", name: "Knight", imgSrc: WhiteKnight },
    { color: "white", name: "Bishop", imgSrc: WhiteBishop },
    { color: "white", name: "Queen", imgSrc: WhiteQueen },
    { color: "white", name: "King", imgSrc: WhiteKing },
    { color: "white", name: "Bishop", imgSrc: WhiteBishop },
    { color: "white", name: "Knight", imgSrc: WhiteKnight },
    { color: "white", name: "Rook", imgSrc: WhiteRook },
  ]);

  // State to track which piece is being dragged
  const [draggedPiece, setDraggedPiece] = useState(null);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [highlightedCells, setHighlightedCells] = useState([]);

  const handleDragStart = (index) => {
    setDraggedPiece(pieces[index]);
    setDraggedIndex(index);
    setHighlightedCells(calculateValidMoves(index));
  };

  const handleDrop = (index) => {
    if (draggedPiece && highlightedCells.includes(index)) {
      const updatedPieces = [...pieces];
      // Remove the piece from the previous position
      updatedPieces[draggedIndex] = null;
      // Place the piece in the new position
      updatedPieces[index] = draggedPiece;
      setPieces(updatedPieces);
      // Reset the dragged piece and index
      setDraggedPiece(null);
      setDraggedIndex(null);
      setHighlightedCells([]);
    }
  };

  const calculateValidMoves = (index) => {
    const piece = pieces[index];
    if (!piece) return [];
    const validMoves = [];

    const row = Math.floor(index / 8);
    const col = index % 8;

    switch (piece.name) {
      case "Pawn":
        const direction = piece.color === "white" ? -1 : 1;
        const startRow = piece.color === "white" ? 6 : 1;

        // Single move forward
        if (
          isInBounds(index + direction * 8) &&
          !pieces[index + direction * 8]
        ) {
          validMoves.push(index + direction * 8);
        }

        // Double move forward
        if (
          row === startRow &&
          isInBounds(index + direction * 16) &&
          !pieces[index + direction * 8] &&
          !pieces[index + direction * 16]
        ) {
          validMoves.push(index + direction * 16);
        }

        // Capture diagonally, but only if there's an opponent's piece there (not empty)
        const diagLeft = index + direction * 7;
        const diagRight = index + direction * 9;

        // Capture left diagonal
        if (
          isInBounds(diagLeft) &&
          pieces[diagLeft] &&
          pieces[diagLeft]?.color !== piece.color
        ) {
          validMoves.push(diagLeft);
        }

        // Capture right diagonal
        if (
          isInBounds(diagRight) &&
          pieces[diagRight] &&
          pieces[diagRight]?.color !== piece.color
        ) {
          validMoves.push(diagRight);
        }

        // Sideways movement (only allowed if another pawn is directly in front and to the side)
        const leftIndex = index - 1;
        const rightIndex = index + 1;
        const frontRowIndex = index + direction * 8;

        // Check if there's a pawn directly in front
        if (isInBounds(frontRowIndex)) {
          const frontRowLeft = frontRowIndex - 1;
          const frontRowRight = frontRowIndex + 1;

          // Allow left move if there's a pawn directly in front and to the left
          if (
            isInBounds(leftIndex) &&
            isInBounds(frontRowLeft) &&
            pieces[frontRowLeft]?.name === "Pawn" &&
            pieces[frontRowLeft]?.color === piece.color &&
            !pieces[leftIndex]
          ) {
            validMoves.push(leftIndex);
          }

          // Allow right move if there's a pawn directly in front and to the right
          if (
            isInBounds(rightIndex) &&
            isInBounds(frontRowRight) &&
            pieces[frontRowRight]?.name === "Pawn" &&
            pieces[frontRowRight]?.color === piece.color &&
            !pieces[rightIndex]
          ) {
            validMoves.push(rightIndex);
          }
        }
        break;

      case "Rook":
        // Horizontal and vertical moves
        const rookDirections = [-1, 1, -8, 8]; // left, right, up, down
        rookDirections.forEach((dir) => {
          for (let i = 1; i < 8; i++) {
            const newIndex = index + dir * i;
            if (!isInBounds(newIndex)) break;
            if (pieces[newIndex]) {
              if (pieces[newIndex].color !== piece.color)
                validMoves.push(newIndex);
              break; // Blocked by another piece
            }
            validMoves.push(newIndex); // Add valid move
          }
        });
        break;

      case "Knight":
        const knightMoves = [-17, -15, -10, -6, 6, 10, 15, 17];
        knightMoves.forEach((move) => {
          const newIndex = index + move;
          if (
            isInBounds(newIndex) &&
            (pieces[newIndex] === null ||
              pieces[newIndex].color !== piece.color)
          ) {
            validMoves.push(newIndex);
          }
        });
        break;

      case "Bishop":
        // Diagonal moves
        const bishopDirections = [-9, -7, 7, 9];
        bishopDirections.forEach((dir) => {
          for (let i = 1; i < 8; i++) {
            const newIndex = index + dir * i;
            const newRow = Math.floor(newIndex / 8);
            const oldRow = Math.floor((index + dir * (i - 1)) / 8);

            // Check boundaries to avoid diagonal wraparound
            if (!isInBounds(newIndex)) break;
            if (Math.abs(newRow - oldRow) !== 1) break;

            if (pieces[newIndex]) {
              if (pieces[newIndex].color !== piece.color)
                validMoves.push(newIndex);
              break; // Blocked by another piece
            }
            validMoves.push(newIndex); // Add valid move
          }
        });
        break;

      case "Queen":
        // Queen moves like both a Rook and a Bishop
        const queenDirections = [-1, 1, -8, 8, -9, -7, 7, 9];
        queenDirections.forEach((dir) => {
          for (let i = 1; i < 8; i++) {
            const newIndex = index + dir * i;
            const newRow = Math.floor(newIndex / 8);
            const oldRow = Math.floor((index + dir * (i - 1)) / 8);

            // Check boundaries to avoid wraparound for rook and diagonal moves
            if (!isInBounds(newIndex)) break;
            if ((dir === -1 || dir === 1) && newRow !== oldRow) break; // Prevent horizontal wrap
            if (
              (dir === -9 || dir === 7 || dir === -7 || dir === 9) &&
              Math.abs(newRow - oldRow) !== 1
            )
              break; // Prevent diagonal wrap

            if (pieces[newIndex]) {
              if (pieces[newIndex].color !== piece.color)
                validMoves.push(newIndex);
              break; // Blocked by another piece
            }
            validMoves.push(newIndex); // Add valid move
          }
        });
        break;

      case "King":
        const kingMoves = [-1, 1, -8, 8, -9, -7, 7, 9];
        kingMoves.forEach((move) => {
          const newIndex = index + move;
          if (
            isInBounds(newIndex) &&
            (pieces[newIndex] === null ||
              pieces[newIndex].color !== piece.color)
          ) {
            validMoves.push(newIndex);
          }
        });
        break;

      default:
        break;
    }

    return validMoves;
  };

  const renderCells = () => {
    return Array.from({ length: 64 }, (_, index) => {
      const piece = pieces[index];
      const label =
        String.fromCharCode(97 + (index % 8)) + (8 - Math.floor(index / 8));
      const isHighlighted = highlightedCells.includes(index);

      return (
        <div
          key={index}
          className={`cell ${isHighlighted ? "highlight" : ""}`}
          onDragOver={(e) => e.preventDefault()} // Allow drop by preventing default
          onDrop={() => handleDrop(index)} // Handle drop
        >
          <div className="cell-label">{label}</div>
          {piece ? (
            <img
              id={`${piece.color}${piece.name}`}
              className="piece-img"
              src={piece.imgSrc}
              alt={`${piece.color} ${piece.name}`}
              draggable
              onDragStart={() => handleDragStart(index)} // Handle drag start
            />
          ) : null}
        </div>
      );
    });
  };

  return <div className="board-container">{renderCells()}</div>;
};
