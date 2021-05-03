const postOptions = {
  schema: {
    body: {
      type: "object",
      required: ["genre"],
      genre: {
        type: "string"
      }
    },
    response: {
      200: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "number" },
            genre: { type: "string" }
          }
        }
      }
    }
  }
};

export default async function (fastify, opts) {
  const genres = fastify.music();
  fastify.get("/", async function (request, reply) {
    return genres;
  });

  fastify.get("/:id", async function (request, reply) {
    try {
      const genre = genres.find(genre => genre.id === +request.params.id);
      return genre;
    } catch (err) {
      reply.code(404).send("Not there" + err);
    }
  });

  // {genre: 'some genre music'}
  fastify.post("/", postOptions, async function (request, reply) {
    const { genre } = request.body;
    if (!genre) {
      reply.code(404).send("not found");
    }
    const listOfGenres = fastify.music(genre);
    return listOfGenres;
  });
}
