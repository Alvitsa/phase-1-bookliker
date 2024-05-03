document.addEventListener("DOMContentLoaded", function() {
    const listElement = document.getElementById("list");
    const showPanelElement = document.getElementById("show-panel");
  
    // Function to fetch and display books
    const fetchAndDisplayBooks = async () => {
      const response = await fetch("http://localhost:3000/books");
      const books = await response.json();
  
      listElement.innerHTML = ""; // Clear previous list
  
      books.forEach(book => {
        const listItem = document.createElement("li");
        listItem.textContent = book.title;
        listItem.addEventListener("click", () => showBookDetails(book));
        listElement.appendChild(listItem);
      });
    };
  
    // Function to show book details
    const showBookDetails = (book) => {
      const likedByCurrentUser = book.users.some(user => user.id === 1); // Assuming user id is 1
      const likeButton = likedByCurrentUser ? `<button id="unlike-btn">Unlike</button>` : `<button id="like-btn">Like</button>`;
      const likedBy = book.users.map(user => user.username).join(", ");
  
      showPanelElement.innerHTML = `
        <h2>${book.title}</h2>
        <img src="${book.thumbnailUrl}" alt="${book.title}" />
        <p>${book.description}</p>
        <p>Liked by: ${likedBy}</p>
        ${likeButton}
      `;
  
      // Add event listener for like/unlike button
      const likeBtn = document.getElementById("like-btn");
      if (likeBtn) {
        likeBtn.addEventListener("click", () => likeBook(book));
      } else {
        const unlikeBtn = document.getElementById("unlike-btn");
        unlikeBtn.addEventListener("click", () => unlikeBook(book));
      }
    };
  
    // Function to handle liking a book
    const likeBook = async (book) => {
      const currentUser = { id: 1, username: "pouros" }; // Assuming user id is 1
      book.users.push(currentUser);
  
      await fetch(`http://localhost:3000/books/${book.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ users: book.users })
      });
  
      showBookDetails(book);
    };
  
    // Function to handle unliking a book
    const unlikeBook = async (book) => {
      const currentUserIndex = book.users.findIndex(user => user.id === 1); // Assuming user id is 1
      book.users.splice(currentUserIndex, 1);
  
      await fetch(`http://localhost:3000/books/${book.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ users: book.users })
      });
  
      showBookDetails(book);
    };
  
    // Fetch and display books on page load
    fetchAndDisplayBooks();
  });