document.addEventListener("click", (event) => {
  if (event.target.dataset.type === "remove") {
    const id = event.target.dataset.id;

    remove(id).then(() => {
      event.target.closest("li").remove();
    });
  }

  if (event.target.dataset.type === "edit") {
    const id = event.target.dataset.id;
    const listItem = event.target.closest("li");
    const currentTitle = listItem.querySelector(".note-title").textContent;

    editNote(id, currentTitle, listItem);
  }
});

async function remove(id) {
  await fetch(`/${id}`, {
    method: "DELETE",
  });
}

async function editNote(id, currentTitle, listItem) {
  const newTitle = prompt("Введите новое название заметки:", currentTitle);

  if (newTitle === null) {
    return;
  }

  if (newTitle.trim() === "") {
    alert("Название заметки не может быть пустым!");
    return;
  }

  try {
    const response = await fetch(`/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: newTitle.trim() }),
    });

    if (response.ok) {
      listItem.querySelector(".note-title").textContent = newTitle.trim();
    } else {
      throw new Error("Ошибка при обновлении заметки");
    }
  } catch (error) {
    console.error(error);
    alert("Произошла ошибка при обновлении заметки");
  }
}
