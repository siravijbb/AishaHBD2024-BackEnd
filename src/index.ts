import {Elysia} from "elysia";
import {cors} from '@elysiajs/cors'
import {PrismaClient} from '@prisma/client'
import {html} from "@elysiajs/html";


let TotalDonate = 0;
let TotalNeeded = 20000;

const db = new PrismaClient();

const app =

    new Elysia()
        .use(cors({
            origin: /.*\.polygang\.fan$/ || "http://localhost:5173",
        }))
        .use(html())
        .get('/', async() => {
            const DonateData = await db.donateData.findFirst({
                where: {
                    id: "1",
                },
            });
        })
        .get(
            '/',
            () => `
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <script>
            window.addEventListener("pageshow", () => {
                var form = $('form'); 
                // let the browser natively reset defaults
                form[0].reset();});
            </script>
            <body class="w-full bg-gray-600">
                
                <form class="my-5 w-1/2 text-xl mx-auto text-center bg-gray-300 rounded-lg py-4" id="myForm" action="/donate" method="post">
                <h1 class="text-center text-4xl ">Aisha Donate API Editer</h1>
                   <p class="inline"> รับมา(เฉพาะยอดใหม่): <input class="w-auto inline p-1  text-sm text-gray-900 bg-gray-400 rounded-lg border border-gray-300" type="number" step="0.01" name="Recived" value="">บาท</p><br>
                    <p class="inline">ยอดทั้งหมด(ไม่ต้องแก้): <input class="w-auto w-fit p-1  text-sm text-gray-900 bg-gray-400 rounded-lg border border-gray-300" type="number" step="0.01" name="Needed" value=20000>บาท</p><br>
                    Authentication Code: <input class=" p-1  text-sm text-gray-900 bg-gray-400 rounded-lg border border-gray-300" type="text" name="Auth" value="Duck"><br>
                    <input class="mt-2 px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-lg" type="submit" value="Submit" ><a href="http://" class="ml-2 mt-2 px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-lg">เช็คยอดหน้าหลัก</a>
            </form>
            </body>`
        )

        .post('/donate', async(req) => {
            const {Auth}: any = req.body as string;
            let {Recived, Needed}: any = req.body ;
            const AuthCode = await db.invitedUser.findFirst({
                where: {
                    invitecode: Auth,
                },
            });
            if(!AuthCode){
                return {
                    message: `Nah bro`
                }}
            else{
                Recived = parseFloat(Recived);
                Needed = parseFloat(Needed);
                let ReadDonateData = await db.donateData.findFirst({
                    where: {
                        id: "1",
                    },
                    select: {
                        TotalDonated: true,
                        TotalNeed: true,
                    },
                })
                if(!ReadDonateData){
                    return {
                        message: `Server Broken`
                    }
                }
                let CombinedDonate = ReadDonateData.TotalDonated + Recived;
                console.debug("C:" +CombinedDonate)
                let UpdateDonateData = await db.donateData.update({
                    where: {
                        id: "1",
                    },
                    data: {
                        TotalNeed: Needed,
                        TotalDonated: CombinedDonate,
                    },
                })
                let VerifyDonateData = await db.donateData.findFirst({
                    where: {
                        id: "1",
                    },
                    select: {
                        TotalDonated: true,
                        TotalNeed: true,
                    },
                })
                if(!VerifyDonateData){
                    return {
                        message: `Server Broken`
                    }
                }
                console.error(Recived)
                let ReturnMessage = ('Total Donate money recived: ') + VerifyDonateData.TotalDonated
                return {
                   message: ReturnMessage
                }

            }

        })

        .listen(3000);


console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
