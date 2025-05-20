import express, {Express} from "express";
import bodyParser from "body-parser";
import axios from "axios";

interface CommentCreatedEvent {
    type: 'CommentCreated';
    data: comment & {
        postId: string;
    }
}

type comment = {
    id: string,
    content: string[],
    status: string
}

type Event = CommentCreatedEvent;

const app: Express = express();
app.use(bodyParser.json());

app.post('/events', async (req, res) => {
    const {type, data} = req.body as Event;

    if (type == 'CommentCreated') {
        const status = data.content.includes('orange') ? 'rejected' : 'approved';

        await axios.post('http://localhost:4005/events', {
            type: 'CommentModerated',
            data: {
                id: data.id,
                postId: data.postId,
                status,
                content: data.content
            }
        });
    }

    res.send({});
});

app.listen(4003, () => {
    console.log('Listening on 4003');
});

