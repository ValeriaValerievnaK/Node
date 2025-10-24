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
    enableEditMode(id, currentTitle, listItem);
  }

  if (event.target.dataset.type === "save") {
    const id = event.target.dataset.id;
    const listItem = event.target.closest("li");
    saveNote(id, listItem);
  }

  if (event.target.dataset.type === "cancel") {
    const listItem = event.target.closest("li");
    disableEditMode(listItem);
  }
});

async function remove(id) {
  await fetch(`/${id}`, {
    method: "DELETE",
  });
}

function enableEditMode(id, currentTitle, listItem) {
  listItem.dataset.originalTitle = currentTitle;
  const editHTML = `
    <div class="input-group input-group-sm me-3 rounded">
      <input type="text" class="form-control edit-input rounded-start" value="${currentTitle}" placeholder="Введите название заметки..">
      <button class="btn btn-success ms-2 rounded" data-type="save" data-id="${id}">Сохранить =)</button>
      <button class="btn btn-danger ms-2 rounded" data-type="cancel">Отменить =(</button>
    </div>
  `;

  const noteContent = listItem.querySelector(".note-content");
  noteContent.innerHTML = editHTML;

  listItem.querySelector(".action-buttons").classList.add("d-none");
}

function disableEditMode(listItem) {
  const originalTitle = listItem.dataset.originalTitle;

  const noteContent = listItem.querySelector(".note-content");
  noteContent.innerHTML = `<span class="note-title">${originalTitle}</span>`;
  listItem.querySelector(".action-buttons").classList.remove("d-none");
}

async function saveNote(id, listItem) {
  const input = listItem.querySelector(".edit-input");
  const newTitle = input.value.trim();

  if (newTitle === "") {
    alert("Название заметки не может быть пустым!");
    input.focus();
    return;
  }

  try {
    const response = await fetch(`/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: newTitle }),
    });

    if (response.ok) {
      const noteContent = listItem.querySelector(".note-content");
      noteContent.innerHTML = `<span class="note-title">${newTitle}</span>`;

      listItem.querySelector(".action-buttons").classList.remove("d-none");
    } else {
      throw new Error("Ошибка при обновлении заметки");
    }
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && event.target.classList.contains("edit-input")) {
    const listItem = event.target.closest("li");
    const saveButton = listItem.querySelector('[data-type="save"]');
    if (saveButton) {
      saveButton.click();
    }
  }

  if (event.key === "Escape" && event.target.classList.contains("edit-input")) {
    const listItem = event.target.closest("li");
    const cancelButton = listItem.querySelector('[data-type="cancel"]');
    if (cancelButton) {
      cancelButton.click();
    }
  }
});
