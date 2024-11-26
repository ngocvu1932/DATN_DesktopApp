import React, { useState } from 'react';
import { Form, Radio, Table, Modal, Card, Descriptions, Timeline } from 'antd';
import 'tailwindcss/tailwind.css';
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons';

interface ServiceRequestImage {
    id: number;
    imageUrl: string;
    description: string;
    status: number;
    customerId: number;
    employeeId: number;
    uploadedAt: string;
    isRemoved: boolean;
    serviceRequestStatusHistoryId: number;
    createdAt: string;
    updatedAt: string;
}

interface StatusHistory {
    id: number;
    status: number;
    note: string | null;
    userId: number | null;
    createdAt: string;
    updatedAt: string;
    isRemoved: boolean;
    serviceRequestId: number;
    serviceRequestImages: ServiceRequestImage[];
}

const data: any[] = [
    {
        id: 5,
        code: "SN00000004",
        currentStatus: 2,
        checkInTime: "2024-10-28T15:23:09.000Z",
        completedTime: null,
        userId: 1,
        createdAt: "2024-10-28T15:23:09.000Z",
        updatedAt: "2024-10-28T15:23:09.000Z",
        isRemoved: false,
        branchId: null,
        employee: {
            id: 3,
            code: "NV000003",
            name: "name 1"
        },
        appointment: {
            id: 1,
            code: "AP000000",
            customerId: 2
        },
        statusHistory: [
            // {
            //     id: 4,
            //     status: 3,
            //     note: "note trang thai 3",
            //     userId: 1,
            //     createdAt: "2024-10-28T15:23:10.000Z",
            //     updatedAt: "2024-10-28T15:23:10.000Z",
            //     isRemoved: false,
            //     serviceRequestId: 5,
            //     serviceRequestImages: [
            //         {
            //             id: 5,
            //             imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvPiuST7Kxc8MBcZxwDtjKYqGZSnJqEG6sRw&s",
            //             description: "Hinh anh hoan thanh khach hang",
            //             status: 2,
            //             customerId: 1,
            //             employeeId: 1,
            //             uploadedAt: "2024-10-28T19:16:08.000Z",
            //             isRemoved: false,
            //             serviceRequestStatusHistoryId: 4,
            //             createdAt: "2024-10-28T19:16:08.000Z",
            //             updatedAt: "2024-10-28T19:16:08.000Z"
            //         },
            //         {
            //             id: 4,
            //             imageUrl: "data:image/jpeg;base64,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",
            //             description: "check in ",
            //             status: 2,
            //             customerId: 1,
            //             employeeId: 1,
            //             uploadedAt: "2024-10-28T19:15:55.000Z",
            //             isRemoved: false,
            //             serviceRequestStatusHistoryId: 4,
            //             createdAt: "2024-10-28T19:15:55.000Z",
            //             updatedAt: "2024-10-28T19:15:55.000Z"
            //         },
            //         {
            //             id: 4,
            //             imageUrl: "data:image/jpeg;base64,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",
            //             description: "da xong",
            //             status: 2,
            //             customerId: 1,
            //             employeeId: 1,
            //             uploadedAt: "2024-10-28T19:15:55.000Z",
            //             isRemoved: false,
            //             serviceRequestStatusHistoryId: 4,
            //             createdAt: "2024-10-28T19:15:55.000Z",
            //             updatedAt: "2024-10-28T19:15:55.000Z"
            //         }
            //         ,
            //         {
            //             id: 4,
            //             imageUrl: "data:image/jpeg;base64,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",
            //             description: "da xong",
            //             status: 2,
            //             customerId: 1,
            //             employeeId: 1,
            //             uploadedAt: "2024-10-28T19:15:55.000Z",
            //             isRemoved: false,
            //             serviceRequestStatusHistoryId: 4,
            //             createdAt: "2024-10-28T19:15:55.000Z",
            //             updatedAt: "2024-10-28T19:15:55.000Z"
            //         }
            //         ,
            //         {
            //             id: 4,
            //             imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTY5_NPfleZvkW8yRdELVAkGleISrtV6y5R2w&s",
            //             description: "da xong",
            //             status: 2,
            //             customerId: 1,
            //             employeeId: 1,
            //             uploadedAt: "2024-10-28T19:15:55.000Z",
            //             isRemoved: false,
            //             serviceRequestStatusHistoryId: 4,
            //             createdAt: "2024-10-28T19:15:55.000Z",
            //             updatedAt: "2024-10-28T19:15:55.000Z"
            //         }
            //         ,
            //         {
            //             id: 4,
            //             imageUrl: "https://res.cloudinary.com/djlhcj7t8/image/upload/v1730142954/serviceRequestImage/e511199c-4ce9-4b02-8dea-9582ed23faea1730142951337.png",
            //             description: "da xong",
            //             status: 2,
            //             customerId: 1,
            //             employeeId: 1,
            //             uploadedAt: "2024-10-28T19:15:55.000Z",
            //             isRemoved: false,
            //             serviceRequestStatusHistoryId: 4,
            //             createdAt: "2024-10-28T19:15:55.000Z",
            //             updatedAt: "2024-10-28T19:15:55.000Z"
            //         }
            //         ,
            //         {
            //             id: 4,
            //             imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTWDgCop4sBGzhOzxP1Fk46ZNw7XHbQkl2nQ&s",
            //             description: "da xong",
            //             status: 2,
            //             customerId: 1,
            //             employeeId: 1,
            //             uploadedAt: "2024-10-28T19:15:55.000Z",
            //             isRemoved: false,
            //             serviceRequestStatusHistoryId: 4,
            //             createdAt: "2024-10-28T19:15:55.000Z",
            //             updatedAt: "2024-10-28T19:15:55.000Z"
            //         }
            //     ]
            // }
            {
                id: 4,
                status: 2,
                note: "note trang thai 2",
                userId: 1,
                createdAt: "2024-10-28T15:23:10.000Z",
                updatedAt: "2024-10-28T15:23:10.000Z",
                isRemoved: false,
                serviceRequestId: 5,
                serviceRequestImages: [
                    {
                        id: 5,
                        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvPiuST7Kxc8MBcZxwDtjKYqGZSnJqEG6sRw&s",
                        description: "Hinh anh dang phuc vu",
                        status: 2,
                        customerId: 1,
                        employeeId: 1,
                        uploadedAt: "2024-10-28T19:16:08.000Z",
                        isRemoved: false,
                        serviceRequestStatusHistoryId: 4,
                        createdAt: "2024-10-28T19:16:08.000Z",
                        updatedAt: "2024-10-28T19:16:08.000Z"
                    },
                    {
                        id: 4,
                        imageUrl: "data:image/jpeg;base64,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",
                        description: "da xong",
                        status: 2,
                        customerId: 1,
                        employeeId: 1,
                        uploadedAt: "2024-10-28T19:15:55.000Z",
                        isRemoved: false,
                        serviceRequestStatusHistoryId: 4,
                        createdAt: "2024-10-28T19:15:55.000Z",
                        updatedAt: "2024-10-28T19:15:55.000Z"
                    },
                    {
                        id: 4,
                        imageUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAQEhAODg4QDw8SDRENDQ4NDQ8PEA0QFxEYIhgRGRYYHyggGCYlJxMTITEhJSkrLi4uGR8zODMtNygtLisBCgoKDg0OFg8NFTcdFSEtLS0tLSsrLSsrKy0tLTctKy0rOCstLS0tLSsrKy03LSstLTc3KzItLS0rKy03LSstK//AABEIAMgAyAMBIgACEQEDEQH/xAAcAAEAAgMBAQEAAAAAAAAAAAAABAYDBQcBAgj/xABNEAABAwIBBAwLBQQIBwAAAAABAAIDBBEFBhITIQcXMUFRU1RhcZGU0RUiMlJicoGSobHBFCMzVdNCgsLwCDRjk6Kys+EkNXR1o6Tx/8QAGQEBAAMBAQAAAAAAAAAAAAAAAAIDBAEF/8QAKhEBAQACAQEHAwQDAAAAAAAAAAECEQMSBBQhMUFRYSJioRUycbEFE1L/2gAMAwEAAhEDEQA/AO4oiICIiAiIgIii1FUG6hrO8AgkPeAo761o3+pYo6Zz9chsN5oNlFxXGKGiF6meGHgEjhnu6G7pTehLNafMdzWC8FafMd7QqVV7MOFsJDftMuu14oWAf4ntXlLsx4W82cKmLXa8sDbD3XOUeqe7q9R1rTv9akseDuLT4VjNDXC9NURTatYYQHt6WnWPaFMfTOZrjOrfaSpbcTkUWmqQ7d1HcIUpAREQEREBERAREQEREBERAREQERfEjrD2II9XUZuobp1AL5hhEYL3kXsS5xNmtC+aVme4yHcvZo+q5XsvZXPkkGD0bjckCrcw63E7kPRbW7q3lHKyTdP5e5Y7Js00hocGBc4uzHVQGtx3DmX1Ael1KqsyTJeX1sz5pb3f4xIvvguNyStzkvhLKVjnjXI1l3Sb7pDqAHMD8lJJ/wB+fn+a8rm7VlldY+TBzdptusPCIMOEUzPJgj9rQ49ZUjEcHpnCMGni/CaSWsAO6d8BZgpFf5TRwRRj4XWXry3vbN/sy3vao1eTJY4TUMr4ZWm7QHkEHmcPGCueQmyXJpG0OLjMkuGR1JGbnO3mvHCd5w3Ta/CoS1+U2Dtqqdr2gaaJzmtfbymkXDTzaitXD2qyyZeTVw9pu9Z+TttVFez2boFzbccP531lpZs4LnOw5lc6pjdh9S4mop2/dOebukiGqx4S06ui3Or84aOT0XawOAr1pdzbc2CLy69XQREQEREBERAREQEREBERAUSvks2w3zZSyoE4zpGDdANyghZSYo3D6KepNvuoiWjzpDqaOshcHyQpnSOlrpiXSPe4Ned0uJu53Sb/ADV+2fMRLKampWn8WZ0rh6MY1fF46lXsIptFDFGBrawZ3rHWfisHbc9Y6nqz9pzuOGp6tqfFiHpvJPQ3UPqoyk1urRt82IE9J1/VRl5UeaKTiP4hHA1repoCjtFyBzgLPiJ+9k9a3UgjqTTa2St9EPHSCO9RipOH+UR50cjfgUop09UcOxGnro9TNIHyAHUW7kjfaCT7V+haoh8Ye03FhI08II3VwLLanzoA/fjkBvzHUf4V2HY6rftGF0jyc52gMLjzxkt/hC9rsmfVh4vV4Murjlvp4LJTPzgDzArMtdh9QLZp1EGxHAtgHX3FqWvUREBERAREQEREBERAREQCoEWuU8AbrU5yhUn4j+gfNBxnZsl0uJUkG8yGPVwF8pv8GhSQP9uhazZHdn46G+boB1MB+q2sQuR0heT22/VIxdsvjIz4j+I4cAa3qCjLPXG8knru+BWBYWJkpxdzR6QHxXtWbvf67j8V9UA+8j9dp+KxSHWfWKD5UnDvxGetbrFlGUPEMZbSljs3SSl144WmxeefgClMbldR3GXK6j4yhhzqedv9mXDpab/RbvYeyso6eidT1VVHC9tS8xtldmlzHBpv13VXp8Fqas3qpXMDvG0ERzWsG74x5lLmyYoAMxkJcb2Mhkfc9AvqHsWzh5seGat22cXLhxS45Xf8O00stNUDPp5IpRul8L2v189ivt8T49bSXN3wTrC4NU5NS0pZPh9TJFNmiTNzy3oAdqvqtuq+bHmyMal4oMRAjq75sclsxs54CN53RqPMvQ4ufHPyasM8c59NdFp6gO6d8KQoFWwtOlbuag4fVS4X5wB9quTZEREBERAREQEREBEXy94G6UHpUKj/ABJOgLJJWMG/1KNhsoc+S3AN5BxDLc3x+X1oh/67VvKby2eu35rSZdtzcffzmE/+Bq3dN5bPXaPiF4/bf3MHbP3T+Cq8t/ru+ZWJZany3+u75lYljZEnDvxGdJPUCVHJ7+tSMOHj9Ebz/hKjX77cKeoxVdQImPkd5LQXFaXJ6kMrnV02uSQnQjio94j6f7rzKd5kMFG065ZLyH0G7/zPsVnw6JrfGt4kbQWje1amge35K7fRh83+l37cPDzv9Mk50bdGNT3WdKQNzgjHz6VHgjznNYN9wHWvl7ySXHdJuek/z8FJodWe/wAxhzT6R1N+ap9FL4rZM57iNy+a08w1BV3KnCc6F1ZFds8DmOzm+Vm6/i0i4W8P8nhWYRh0MrTrD3NYQd8a7qzjzuGUsWcedxyli87HmUPhGhjmfbStBgqB6bRu9BBB9p4FvaE2LmHeNh0LkmwNVFk9dSE6s1soHpMeWn4Ob1Lqs0wjmPOAT0r3sLuSvWbRFHZVsO+szXA7ikPpERAREQEREHy91goMUelu5xObewHCpFabNPQtfi1U6ChqJ4/Ljo552X85sTiPiAgx4hjeH0rsyoqaeGS18ySVgcB0ErAMtcKG5iFKOG0rQuRbH2SkGJMnrK50kshnLdUhbc2BLieHXboVt2scM4uX+/eq+ur5wWzal5e4jBNjLKinlZLG4U/3kbgW5wFiL9S3tPOzOZ47PLb+0OFbfaxwzi5f79692ssM4uXtD1l5uD/Zd70p5uw3ks8daaeqmZnv8dnln9ocJWPTM89vvBbzaxwzi5e0PTaxwzi5e0PVHc/uU/pl/wCmsop2DSHPb+E/9ob+pRhMzz29YW82scM4uXtD02scM4uXtD07n9x+mX3UTDZGy1lRO5wtGBDHcjXwnrB61aJp2NjYwPZdx0rvGHQB9fatntY4ZxcvaHptY4ZxcvaHqefZeqzxTy/x1y9Wj0zPPb7wUl07GxAZ7LvcXEZw8luofElbPaxwzi5e0PTaxwzi5e0PUO5/ch+mX3aMzM89vvBSXzsETBnsu6RzyM8bg1D43Wz2scM4uXtD02scM4uXtD07n9xP8Zf+lS2LMVp6bEquWpnjhjdFM1rpHBrXOMzSAD0Arrhy0wrfxCl6TKxU/aywzi5e0PQbGOGcXL/fvW/G9M02d3sml6wzEqGqzvs08ExGtwhla4t5yAdSlFuicNZLSbC53CuEZZ4SzBamjqcPfIwkudmudnWLSLi512cCdRXesQ8i/OLcysxu1WeNxuqlgr1Y4T4o6FkUkRERAREKCNXeSehajKf/AJXXf9tqv9B63FaPFPQVqsoYXPw6rjYCXOw+oY1o3S4wuAA9q5fIc72Fv6nN/wBW7/TYugrl+xDjNNDTzwzTxwyfaDJmyvDM5paACCd3WDfoV+8P0XLKbtEfeqXocdnTGyRa3w/Rcspu0R96eH6LllN2iPvRPcbJFrfD9Fyym7RH3p4fouWU3aI+9DcbJFrfD9Fyym7RH3p4fouWU3aI+9DcbJFrfD9Fyym7RH3p4fouWU3aI+9DcbJFrfD9Fyym7RH3p4fouWU3aI+9DcbJFrfD9Fyym7RH3p4fouWU3aI+9DcbJerWeH6LllN2iPvQ4/Rcspu0R96G453s3+VRerN82LteI+R+835rheyzXw1c1HDSyNnkGe0iFwe3OeWhrbg6ybLumIDxP3m/NWYMXNd5M9P5I6FkWODyR0LIpqRERAREQY5W3HssotLLm/du1a9RO4VOWCogDgbjeQU3GNi/DKqQzmOSJ7iS/wCzy5rXu3yQQQD0WXK8msmYH4nWUL2aSKEztiD3G9mSgAki2uy77hTbBzd7O1XK4/gXiZR1rfOdUW9tiq85NLuG/VNt5td0XJme/L3ptd0XJme/L3q6rxV6jfv4/Cl7XdFyZnvy96bXdFyZnvy96uiJqG/j8KXtd0XJme/L3ptd0XJme/L3q6Imob+Pwpe13RcmZ78vem13RcmZ78veroiahv4/Cl7XdFyZnvy96bXdFyZnvy96uiJqG/j8KXtd0XJme/L3ptd0XJme/L3q6Imob+Pwpe13RclZ7ZJe9UemyVp5saOGlro4LkERO8YWgztRN99dsXM8lfHylnd5um+EIC7JNqee/T4ResndjvDqCQTxRufKL5sk7w8x73iiwF9e7ZWOZ+kIa3WAbkg6ivjEY858YJ1ayRzqdDEGjUFdJpgt2+mi2pfSIugiIgIiIC8duHoXq8KCDRHx5G71wVyCcaLKd/8AaOP+KmXYKYgSPG+RcLkOXH3WUVJJvSfZzfpuz6KGfks479UdMsiIq3oCIiAiIgIiICIiAiIgLmmxmNJjuIS+aKk36Zmj6LpTjbXwC/Uuc7Brc+sxKfmAB9eVx/hXcfOM/aL4R1iY3lDeBtwp4UB2uU+rYqermMREQEREBERAQoiCABab90gLk2zW3RV+G1PogX9SYH+JdZqRaRhPCuaf0gKa8FHMP2J3x34M5tx/kUcvJLG6q9A31810/myh4NUaWngl8+njffpaCVMVT0ZfBSMqdkaCikNPHE6olaQJM14YyMneJsSSpmR+XFPiJMQY6GcDO0b3Ah7eFp1X6N1cSygppIqmojmH3gnkzr7rruuHe0ELdbGdNI/Eacx3tG50srgNTY80g36dz2rm2ecl6tO/Ig/+fz1LR0+VuHue+IVkQkY8sc2R2jIcNR1uAvuLrRcpG8RQ34rTAZxqYALXuZo7dd1EospqKeb7NBUsllzXODY7uFhu+MNXxQ3G3VKyr2RKeikNPHGaiZthIGuDGRk7xNiSeZXVfmvKemkiq6lkwOk+0SOcT+1dxIcOYggrivlyuM8HZ8j8uqfEXGHMdDPmlwjc4OEgG6WuHyVtX592OqaR+I02jB8SUyyEDyI2g3J6dz2r9BfzZdd48rZ4omLzaOCeTzIJX9TSVUP6P0H3FbN508bAeENYT/Et1l/UaPD6x3DAYx+8QPqvnYRpczDA+1tJUyyewEAf5V3DzU9ovlFzpxeSQjhU5QcPHlH0iQeFT1cyiIiAiIgIiICIiCBiI3HHeIJVR2aKXSYXI8C+imhmHRnW/iVyxFvinm1rU5Y0v2jDauMbrqORzR6TW3HxAXLNx2eat7HVTpMOpTe+bGYifUcQPgArKqBsM1WdRyRb8dS6w9FzQR8c5X9UvQwu8Y02N5MUdaQ6qga9wFhICWPtwZzSDbpUjBsDpqNpZSwtiB8oi5e7pcbk+1bFES6YLS4nkrQVJLp6SJzibl4bo3k87m2JW6RCyXzVEbG+Fg3+zuPMZpbfNb3CsDpaX+rU0cRtYuY3xyOAuOs+0rYojnTPSBWoxvJqjrbGqgbI4CzZASx4HBnNINuYrbojtkvhWswXAaWiaW0sLYr+U4Xc9/S43J9q2aIhJryUfZgqcygzN+SojZbhAuT8QFcNj+m0GF0bDq/4USHpfd38S5vszzFzqGlbuuc6QjnJa0fVdf0Qhp2RW1MiZEB0AD6KeE8WPnv1MuGts34qYsFG2zR0BZ1YoEREBERAREQEREGGpbdp6FgpRnxljt8FhA4DqUwhQAdE4k+S7d5ig4pkXWDCK+rw+sOiY9wDJHamXaTmOPM4O3V1hjwRcOBBFwWuBBHMd8c6x5VZHUWKNGnaRIBaOeIhsjRwE745iqQdhZw1MxaRrd4fZSSB7JR8lVcb6NGHNqaq/X50vzqhbS8n5zJ2V/6ybS8n5zJ2V/6y501PvE9l9vzpfnVC2l5PzmTsr/1k2l5PzmTsr/1k6ad4nsvt+dL86oW0vJ+cydlf+sm0vJ+cydlf+snTTvE9l9vzpfnVC2l5PzmTsr/1k2l5PzmTsr/1k6ad4nsvt+dYp6hkbS+R7WMAuXPdmtA5yqMdheT85k7K/wDWXrNhS5GmxWSRl9bRT5pPQTIQOop007xPZpI5PDONwGAF1NTOYXSWsCyN1y48GcdQ4V2vEDqa3hdc+xa7J7J2kw2LR00eYDrkke7Okld6R+g1cynwgyOzzubjehWYzUZssuq7TI22AC+0CKSIiIgIiICIiAiIgL4ewHdREEQ0djdji3mBQwy8YURB5oZeMPUmhl4w9SIgaGXjD1JoZeMPUiIGhl4w9SaGXjD1IiBoZeMPUmhl4w9SIgaGXjD1IIZeMK9RB6yi33EuPOVLa22oIiD6REQEREBERB//2Q==",
                        description: "da xong",
                        status: 2,
                        customerId: 1,
                        employeeId: 1,
                        uploadedAt: "2024-10-28T19:15:55.000Z",
                        isRemoved: false,
                        serviceRequestStatusHistoryId: 4,
                        createdAt: "2024-10-28T19:15:55.000Z",
                        updatedAt: "2024-10-28T19:15:55.000Z"
                    }
                    ,
                    {
                        id: 4,
                        imageUrl: "data:image/jpeg;base64,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",
                        description: "da xong",
                        status: 2,
                        customerId: 1,
                        employeeId: 1,
                        uploadedAt: "2024-10-28T19:15:55.000Z",
                        isRemoved: false,
                        serviceRequestStatusHistoryId: 4,
                        createdAt: "2024-10-28T19:15:55.000Z",
                        updatedAt: "2024-10-28T19:15:55.000Z"
                    }
                    ,
                    {
                        id: 4,
                        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTY5_NPfleZvkW8yRdELVAkGleISrtV6y5R2w&s",
                        description: "da xong",
                        status: 2,
                        customerId: 1,
                        employeeId: 1,
                        uploadedAt: "2024-10-28T19:15:55.000Z",
                        isRemoved: false,
                        serviceRequestStatusHistoryId: 4,
                        createdAt: "2024-10-28T19:15:55.000Z",
                        updatedAt: "2024-10-28T19:15:55.000Z"
                    }
                    ,
                    {
                        id: 4,
                        imageUrl: "https://res.cloudinary.com/djlhcj7t8/image/upload/v1730142954/serviceRequestImage/e511199c-4ce9-4b02-8dea-9582ed23faea1730142951337.png",
                        description: "da xong",
                        status: 2,
                        customerId: 1,
                        employeeId: 1,
                        uploadedAt: "2024-10-28T19:15:55.000Z",
                        isRemoved: false,
                        serviceRequestStatusHistoryId: 4,
                        createdAt: "2024-10-28T19:15:55.000Z",
                        updatedAt: "2024-10-28T19:15:55.000Z"
                    }
                    ,
                    {
                        id: 4,
                        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTWDgCop4sBGzhOzxP1Fk46ZNw7XHbQkl2nQ&s",
                        description: "da xong",
                        status: 2,
                        customerId: 1,
                        employeeId: 1,
                        uploadedAt: "2024-10-28T19:15:55.000Z",
                        isRemoved: false,
                        serviceRequestStatusHistoryId: 4,
                        createdAt: "2024-10-28T19:15:55.000Z",
                        updatedAt: "2024-10-28T19:15:55.000Z"
                    }
                ]
            },
            {
                id: 4,
                status: 1,
                note: "note trang thai 1",
                userId: 1,
                createdAt: "2024-10-28T15:23:10.000Z",
                updatedAt: "2024-10-28T15:23:10.000Z",
                isRemoved: false,
                serviceRequestId: 5,
                serviceRequestImages: [
                    {
                        id: 5,
                        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvPiuST7Kxc8MBcZxwDtjKYqGZSnJqEG6sRw&s",
                        description: "Hinh anh check in khach hang",
                        status: 2,
                        customerId: 1,
                        employeeId: 1,
                        uploadedAt: "2024-10-28T19:16:08.000Z",
                        isRemoved: false,
                        serviceRequestStatusHistoryId: 4,
                        createdAt: "2024-10-28T19:16:08.000Z",
                        updatedAt: "2024-10-28T19:16:08.000Z"
                    },
                    {
                        id: 4,
                        imageUrl: "data:image/jpeg;base64,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",
                        description: "check in ",
                        status: 2,
                        customerId: 1,
                        employeeId: 1,
                        uploadedAt: "2024-10-28T19:15:55.000Z",
                        isRemoved: false,
                        serviceRequestStatusHistoryId: 4,
                        createdAt: "2024-10-28T19:15:55.000Z",
                        updatedAt: "2024-10-28T19:15:55.000Z"
                    },
                    {
                        id: 4,
                        imageUrl: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAQEhAODg4QDw8SDRENDQ4NDQ8PEA0QFxEYIhgRGRYYHyggGCYlJxMTITEhJSkrLi4uGR8zODMtNygtLisBCgoKDg0OFg8NFTcdFSEtLS0tLSsrLSsrKy0tLTctKy0rOCstLS0tLSsrKy03LSstLTc3KzItLS0rKy03LSstK//AABEIAMgAyAMBIgACEQEDEQH/xAAcAAEAAgMBAQEAAAAAAAAAAAAABAYDBQcBAgj/xABNEAABAwIBBAwLBQQIBwAAAAABAAIDBBEFBhITIQcXMUFRU1RhcZGU0RUiMlJicoGSobHBFCMzVdNCgsLwCDRjk6Kys+EkNXR1o6Tx/8QAGQEBAAMBAQAAAAAAAAAAAAAAAAIDBAEF/8QAKhEBAQACAQEHAwQDAAAAAAAAAAECEQMSBBQhMUFRYSJioRUycbEFE1L/2gAMAwEAAhEDEQA/AO4oiICIiAiIgIii1FUG6hrO8AgkPeAo761o3+pYo6Zz9chsN5oNlFxXGKGiF6meGHgEjhnu6G7pTehLNafMdzWC8FafMd7QqVV7MOFsJDftMuu14oWAf4ntXlLsx4W82cKmLXa8sDbD3XOUeqe7q9R1rTv9akseDuLT4VjNDXC9NURTatYYQHt6WnWPaFMfTOZrjOrfaSpbcTkUWmqQ7d1HcIUpAREQEREBERAREQEREBERAREQERfEjrD2II9XUZuobp1AL5hhEYL3kXsS5xNmtC+aVme4yHcvZo+q5XsvZXPkkGD0bjckCrcw63E7kPRbW7q3lHKyTdP5e5Y7Js00hocGBc4uzHVQGtx3DmX1Ael1KqsyTJeX1sz5pb3f4xIvvguNyStzkvhLKVjnjXI1l3Sb7pDqAHMD8lJJ/wB+fn+a8rm7VlldY+TBzdptusPCIMOEUzPJgj9rQ49ZUjEcHpnCMGni/CaSWsAO6d8BZgpFf5TRwRRj4XWXry3vbN/sy3vao1eTJY4TUMr4ZWm7QHkEHmcPGCueQmyXJpG0OLjMkuGR1JGbnO3mvHCd5w3Ta/CoS1+U2Dtqqdr2gaaJzmtfbymkXDTzaitXD2qyyZeTVw9pu9Z+TttVFez2boFzbccP531lpZs4LnOw5lc6pjdh9S4mop2/dOebukiGqx4S06ui3Or84aOT0XawOAr1pdzbc2CLy69XQREQEREBERAREQEREBERAUSvks2w3zZSyoE4zpGDdANyghZSYo3D6KepNvuoiWjzpDqaOshcHyQpnSOlrpiXSPe4Ned0uJu53Sb/ADV+2fMRLKampWn8WZ0rh6MY1fF46lXsIptFDFGBrawZ3rHWfisHbc9Y6nqz9pzuOGp6tqfFiHpvJPQ3UPqoyk1urRt82IE9J1/VRl5UeaKTiP4hHA1repoCjtFyBzgLPiJ+9k9a3UgjqTTa2St9EPHSCO9RipOH+UR50cjfgUop09UcOxGnro9TNIHyAHUW7kjfaCT7V+haoh8Ye03FhI08II3VwLLanzoA/fjkBvzHUf4V2HY6rftGF0jyc52gMLjzxkt/hC9rsmfVh4vV4Murjlvp4LJTPzgDzArMtdh9QLZp1EGxHAtgHX3FqWvUREBERAREQEREBERAREQCoEWuU8AbrU5yhUn4j+gfNBxnZsl0uJUkG8yGPVwF8pv8GhSQP9uhazZHdn46G+boB1MB+q2sQuR0heT22/VIxdsvjIz4j+I4cAa3qCjLPXG8knru+BWBYWJkpxdzR6QHxXtWbvf67j8V9UA+8j9dp+KxSHWfWKD5UnDvxGetbrFlGUPEMZbSljs3SSl144WmxeefgClMbldR3GXK6j4yhhzqedv9mXDpab/RbvYeyso6eidT1VVHC9tS8xtldmlzHBpv13VXp8Fqas3qpXMDvG0ERzWsG74x5lLmyYoAMxkJcb2Mhkfc9AvqHsWzh5seGat22cXLhxS45Xf8O00stNUDPp5IpRul8L2v189ivt8T49bSXN3wTrC4NU5NS0pZPh9TJFNmiTNzy3oAdqvqtuq+bHmyMal4oMRAjq75sclsxs54CN53RqPMvQ4ufHPyasM8c59NdFp6gO6d8KQoFWwtOlbuag4fVS4X5wB9quTZEREBERAREQEREBEXy94G6UHpUKj/ABJOgLJJWMG/1KNhsoc+S3AN5BxDLc3x+X1oh/67VvKby2eu35rSZdtzcffzmE/+Bq3dN5bPXaPiF4/bf3MHbP3T+Cq8t/ru+ZWJZany3+u75lYljZEnDvxGdJPUCVHJ7+tSMOHj9Ebz/hKjX77cKeoxVdQImPkd5LQXFaXJ6kMrnV02uSQnQjio94j6f7rzKd5kMFG065ZLyH0G7/zPsVnw6JrfGt4kbQWje1amge35K7fRh83+l37cPDzv9Mk50bdGNT3WdKQNzgjHz6VHgjznNYN9wHWvl7ySXHdJuek/z8FJodWe/wAxhzT6R1N+ap9FL4rZM57iNy+a08w1BV3KnCc6F1ZFds8DmOzm+Vm6/i0i4W8P8nhWYRh0MrTrD3NYQd8a7qzjzuGUsWcedxyli87HmUPhGhjmfbStBgqB6bRu9BBB9p4FvaE2LmHeNh0LkmwNVFk9dSE6s1soHpMeWn4Ob1Lqs0wjmPOAT0r3sLuSvWbRFHZVsO+szXA7ikPpERAREQEREHy91goMUelu5xObewHCpFabNPQtfi1U6ChqJ4/Ljo552X85sTiPiAgx4hjeH0rsyoqaeGS18ySVgcB0ErAMtcKG5iFKOG0rQuRbH2SkGJMnrK50kshnLdUhbc2BLieHXboVt2scM4uX+/eq+ur5wWzal5e4jBNjLKinlZLG4U/3kbgW5wFiL9S3tPOzOZ47PLb+0OFbfaxwzi5f79692ssM4uXtD1l5uD/Zd70p5uw3ks8daaeqmZnv8dnln9ocJWPTM89vvBbzaxwzi5e0PTaxwzi5e0PVHc/uU/pl/wCmsop2DSHPb+E/9ob+pRhMzz29YW82scM4uXtD02scM4uXtD07n9x+mX3UTDZGy1lRO5wtGBDHcjXwnrB61aJp2NjYwPZdx0rvGHQB9fatntY4ZxcvaHptY4ZxcvaHqefZeqzxTy/x1y9Wj0zPPb7wUl07GxAZ7LvcXEZw8luofElbPaxwzi5e0PTaxwzi5e0PUO5/ch+mX3aMzM89vvBSXzsETBnsu6RzyM8bg1D43Wz2scM4uXtD02scM4uXtD07n9xP8Zf+lS2LMVp6bEquWpnjhjdFM1rpHBrXOMzSAD0Arrhy0wrfxCl6TKxU/aywzi5e0PQbGOGcXL/fvW/G9M02d3sml6wzEqGqzvs08ExGtwhla4t5yAdSlFuicNZLSbC53CuEZZ4SzBamjqcPfIwkudmudnWLSLi512cCdRXesQ8i/OLcysxu1WeNxuqlgr1Y4T4o6FkUkRERAREKCNXeSehajKf/AJXXf9tqv9B63FaPFPQVqsoYXPw6rjYCXOw+oY1o3S4wuAA9q5fIc72Fv6nN/wBW7/TYugrl+xDjNNDTzwzTxwyfaDJmyvDM5paACCd3WDfoV+8P0XLKbtEfeqXocdnTGyRa3w/Rcspu0R96eH6LllN2iPvRPcbJFrfD9Fyym7RH3p4fouWU3aI+9DcbJFrfD9Fyym7RH3p4fouWU3aI+9DcbJFrfD9Fyym7RH3p4fouWU3aI+9DcbJFrfD9Fyym7RH3p4fouWU3aI+9DcbJFrfD9Fyym7RH3p4fouWU3aI+9DcbJerWeH6LllN2iPvQ4/Rcspu0R96G453s3+VRerN82LteI+R+835rheyzXw1c1HDSyNnkGe0iFwe3OeWhrbg6ybLumIDxP3m/NWYMXNd5M9P5I6FkWODyR0LIpqRERAREQY5W3HssotLLm/du1a9RO4VOWCogDgbjeQU3GNi/DKqQzmOSJ7iS/wCzy5rXu3yQQQD0WXK8msmYH4nWUL2aSKEztiD3G9mSgAki2uy77hTbBzd7O1XK4/gXiZR1rfOdUW9tiq85NLuG/VNt5td0XJme/L3ptd0XJme/L3q6rxV6jfv4/Cl7XdFyZnvy96bXdFyZnvy96uiJqG/j8KXtd0XJme/L3ptd0XJme/L3q6Imob+Pwpe13RcmZ78vem13RcmZ78veroiahv4/Cl7XdFyZnvy96bXdFyZnvy96uiJqG/j8KXtd0XJme/L3ptd0XJme/L3q6Imob+Pwpe13RclZ7ZJe9UemyVp5saOGlro4LkERO8YWgztRN99dsXM8lfHylnd5um+EIC7JNqee/T4ResndjvDqCQTxRufKL5sk7w8x73iiwF9e7ZWOZ+kIa3WAbkg6ivjEY858YJ1ayRzqdDEGjUFdJpgt2+mi2pfSIugiIgIiIC8duHoXq8KCDRHx5G71wVyCcaLKd/8AaOP+KmXYKYgSPG+RcLkOXH3WUVJJvSfZzfpuz6KGfks479UdMsiIq3oCIiAiIgIiICIiAiIgLmmxmNJjuIS+aKk36Zmj6LpTjbXwC/Uuc7Brc+sxKfmAB9eVx/hXcfOM/aL4R1iY3lDeBtwp4UB2uU+rYqermMREQEREBERAQoiCABab90gLk2zW3RV+G1PogX9SYH+JdZqRaRhPCuaf0gKa8FHMP2J3x34M5tx/kUcvJLG6q9A31810/myh4NUaWngl8+njffpaCVMVT0ZfBSMqdkaCikNPHE6olaQJM14YyMneJsSSpmR+XFPiJMQY6GcDO0b3Ah7eFp1X6N1cSygppIqmojmH3gnkzr7rruuHe0ELdbGdNI/Eacx3tG50srgNTY80g36dz2rm2ecl6tO/Ig/+fz1LR0+VuHue+IVkQkY8sc2R2jIcNR1uAvuLrRcpG8RQ34rTAZxqYALXuZo7dd1EospqKeb7NBUsllzXODY7uFhu+MNXxQ3G3VKyr2RKeikNPHGaiZthIGuDGRk7xNiSeZXVfmvKemkiq6lkwOk+0SOcT+1dxIcOYggrivlyuM8HZ8j8uqfEXGHMdDPmlwjc4OEgG6WuHyVtX592OqaR+I02jB8SUyyEDyI2g3J6dz2r9BfzZdd48rZ4omLzaOCeTzIJX9TSVUP6P0H3FbN508bAeENYT/Et1l/UaPD6x3DAYx+8QPqvnYRpczDA+1tJUyyewEAf5V3DzU9ovlFzpxeSQjhU5QcPHlH0iQeFT1cyiIiAiIgIiICIiCBiI3HHeIJVR2aKXSYXI8C+imhmHRnW/iVyxFvinm1rU5Y0v2jDauMbrqORzR6TW3HxAXLNx2eat7HVTpMOpTe+bGYifUcQPgArKqBsM1WdRyRb8dS6w9FzQR8c5X9UvQwu8Y02N5MUdaQ6qga9wFhICWPtwZzSDbpUjBsDpqNpZSwtiB8oi5e7pcbk+1bFES6YLS4nkrQVJLp6SJzibl4bo3k87m2JW6RCyXzVEbG+Fg3+zuPMZpbfNb3CsDpaX+rU0cRtYuY3xyOAuOs+0rYojnTPSBWoxvJqjrbGqgbI4CzZASx4HBnNINuYrbojtkvhWswXAaWiaW0sLYr+U4Xc9/S43J9q2aIhJryUfZgqcygzN+SojZbhAuT8QFcNj+m0GF0bDq/4USHpfd38S5vszzFzqGlbuuc6QjnJa0fVdf0Qhp2RW1MiZEB0AD6KeE8WPnv1MuGts34qYsFG2zR0BZ1YoEREBERAREQEREGGpbdp6FgpRnxljt8FhA4DqUwhQAdE4k+S7d5ig4pkXWDCK+rw+sOiY9wDJHamXaTmOPM4O3V1hjwRcOBBFwWuBBHMd8c6x5VZHUWKNGnaRIBaOeIhsjRwE745iqQdhZw1MxaRrd4fZSSB7JR8lVcb6NGHNqaq/X50vzqhbS8n5zJ2V/6ybS8n5zJ2V/6y501PvE9l9vzpfnVC2l5PzmTsr/1k2l5PzmTsr/1k6ad4nsvt+dL86oW0vJ+cydlf+sm0vJ+cydlf+snTTvE9l9vzpfnVC2l5PzmTsr/1k2l5PzmTsr/1k6ad4nsvt+dYp6hkbS+R7WMAuXPdmtA5yqMdheT85k7K/wDWXrNhS5GmxWSRl9bRT5pPQTIQOop007xPZpI5PDONwGAF1NTOYXSWsCyN1y48GcdQ4V2vEDqa3hdc+xa7J7J2kw2LR00eYDrkke7Okld6R+g1cynwgyOzzubjehWYzUZssuq7TI22AC+0CKSIiIgIiICIiAiIgL4ewHdREEQ0djdji3mBQwy8YURB5oZeMPUmhl4w9SIgaGXjD1JoZeMPUiIGhl4w9SaGXjD1IiBoZeMPUmhl4w9SIgaGXjD1IIZeMK9RB6yi33EuPOVLa22oIiD6REQEREBERB//2Q==",
                        description: "da xong",
                        status: 2,
                        customerId: 1,
                        employeeId: 1,
                        uploadedAt: "2024-10-28T19:15:55.000Z",
                        isRemoved: false,
                        serviceRequestStatusHistoryId: 4,
                        createdAt: "2024-10-28T19:15:55.000Z",
                        updatedAt: "2024-10-28T19:15:55.000Z"
                    }
                    ,
                    {
                        id: 4,
                        imageUrl: "data:image/jpeg;base64,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",
                        description: "da xong",
                        status: 2,
                        customerId: 1,
                        employeeId: 1,
                        uploadedAt: "2024-10-28T19:15:55.000Z",
                        isRemoved: false,
                        serviceRequestStatusHistoryId: 4,
                        createdAt: "2024-10-28T19:15:55.000Z",
                        updatedAt: "2024-10-28T19:15:55.000Z"
                    }
                    ,
                    {
                        id: 4,
                        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTY5_NPfleZvkW8yRdELVAkGleISrtV6y5R2w&s",
                        description: "da xong",
                        status: 2,
                        customerId: 1,
                        employeeId: 1,
                        uploadedAt: "2024-10-28T19:15:55.000Z",
                        isRemoved: false,
                        serviceRequestStatusHistoryId: 4,
                        createdAt: "2024-10-28T19:15:55.000Z",
                        updatedAt: "2024-10-28T19:15:55.000Z"
                    }
                    ,
                    {
                        id: 4,
                        imageUrl: "https://res.cloudinary.com/djlhcj7t8/image/upload/v1730142954/serviceRequestImage/e511199c-4ce9-4b02-8dea-9582ed23faea1730142951337.png",
                        description: "da xong",
                        status: 2,
                        customerId: 1,
                        employeeId: 1,
                        uploadedAt: "2024-10-28T19:15:55.000Z",
                        isRemoved: false,
                        serviceRequestStatusHistoryId: 4,
                        createdAt: "2024-10-28T19:15:55.000Z",
                        updatedAt: "2024-10-28T19:15:55.000Z"
                    }
                    ,
                    {
                        id: 4,
                        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTWDgCop4sBGzhOzxP1Fk46ZNw7XHbQkl2nQ&s",
                        description: "da xong",
                        status: 2,
                        customerId: 1,
                        employeeId: 1,
                        uploadedAt: "2024-10-28T19:15:55.000Z",
                        isRemoved: false,
                        serviceRequestStatusHistoryId: 4,
                        createdAt: "2024-10-28T19:15:55.000Z",
                        updatedAt: "2024-10-28T19:15:55.000Z"
                    }
                ]
            }
        ],
        customer: {
            id: 2,
            code: "KH000002",
            name: "khach hang 2",
            phone: null,
            email: null
        }
    }
];

const ServiceRequestDetail: React.FC = () => {
    const [form] = Form.useForm();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
    const [selectedImageDescription, setSelectedImageDescription] = useState<string>('');
    const [isAllImagesModalVisible, setIsAllImagesModalVisible] = useState(false);

    const showModal = (imageUrl: string, description: string) => {
        setSelectedImageUrl(imageUrl);
        setSelectedImageDescription(description)
        setIsModalVisible(true);
    };

    const showAllImagesModal = (images: ServiceRequestImage[]) => {
        setIsAllImagesModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setIsAllImagesModalVisible(false)
    };

    const onFinish = (values: any) => {
        console.log('Received values:', values);
    };

    return (
        <div>
            {data.map((request) => (
                <div key={request.id}>
                    <div>
                        <Card title="Thông tin yêu cầu dịch vụ  " bordered={false}>
                            <Descriptions column={1}>
                                <Descriptions.Item label="Mã yêu cầu">{request.code}</Descriptions.Item>
                                <Descriptions.Item label="Mã lịch hẹn">{request.appointment.code}</Descriptions.Item>
                                <Descriptions.Item label="Khách hàng">{request.customer.name}</Descriptions.Item>
                                <Descriptions.Item label="Nhân viên">{request.employee.name}</Descriptions.Item>
                                <Descriptions.Item label="Thời gian check-in">{new Date(request.checkInTime).toLocaleString()}</Descriptions.Item>
                                <Descriptions.Item label="Trạng thái hiện tại">{request.currentStatus}</Descriptions.Item>
                                <Descriptions.Item label="Thời gian tạo">{new Date(request.createdAt).toLocaleString()}</Descriptions.Item>
                            </Descriptions>

                        </Card>
                    </div>
                    <div>
                        <Card title="Lịch sử trạng thái" bordered={false} style={{ marginTop: '20px' }}>
                            <Timeline mode="left">
                                {request.statusHistory.map((statusItem: any, index: number) => {
                                    let icon;
                                    switch (statusItem.status) {
                                        case 1:
                                            icon = <ClockCircleOutlined />;
                                            break;
                                        case 2:
                                            icon = <LoadingOutlined />;
                                            break;
                                        case 3:
                                            icon = <CheckCircleOutlined />;
                                            break;
                                        case 4:
                                            icon = <CloseCircleOutlined />;
                                            break;
                                        default:
                                            icon = <ClockCircleOutlined />;
                                    }

                                    return (
                                        <Timeline.Item key={index}>
                                            <div className="flex items-center space-x-4">
                                                <div className="flex-shrink-0">
                                                    {icon}
                                                </div>

                                                <div>
                                                    <p className="font-semibold">{statusItem.status}</p>
                                                    {statusItem.createdAt && (
                                                        <p className="text-gray-500 text-sm">{new Date(statusItem.createdAt).toLocaleString()}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </Timeline.Item>
                                    );
                                })}
                            </Timeline>
                        </Card>
                        {/* <Card title="Lịch sử trạng thái" bordered={false} style={{ marginTop: '20px' }}>
                            <div className="overflow-x-auto">
                                <div className="flex space-x-6"> 
                                    {request.statusHistory.map((statusItem: any, index: number) => {
                                        let icon;
                                        switch (statusItem.status) {
                                            case 'Đang chờ':
                                                icon = <ClockCircleOutlined />;
                                                break;
                                            case 'Đang xử lý':
                                                icon = <LoadingOutlined />;
                                                break;
                                            case 'Hoàn thành':
                                                icon = <CheckCircleOutlined />;
                                                break;
                                            case 'Hủy':
                                                icon = <CloseCircleOutlined />;
                                                break;
                                            default:
                                                icon = <ClockCircleOutlined />;
                                        }

                                        return (
                                            <div key={index} className="flex items-center space-x-4">

                                                <div className="flex-shrink-0">
                                                    {icon}
                                                </div>


                                                <div className="flex flex-col">
                                                    <p className="font-semibold">{statusItem.status}</p>
                                                    {statusItem.createdAt && (
                                                        <p className="text-gray-500 text-sm">{new Date(statusItem.createdAt).toLocaleString()}</p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </Card> */}
                    </div>

                    <div>
                        <Card title="Lịch sử liệu trình" bordered={false} style={{ marginTop: '20px' }}>

                            <Table
                                dataSource={request.statusHistory}
                                columns={[
                                    {
                                        title: 'Trạng thái',
                                        dataIndex: 'status',
                                        key: 'status',
                                    },
                                    {
                                        title: 'Ngày cập nhật',
                                        dataIndex: 'createdAt',
                                        // key: 'createdAt',
                                        render: (createdAt: string) => (
                                            <p>{new Date(createdAt).toLocaleString()}</p>
                                        ),
                                    },
                                    {
                                        title: 'Ghi chú',
                                        dataIndex: 'note',
                                        key: 'note',
                                    },
                                    {
                                        title: 'Hình ảnh',
                                        dataIndex: 'serviceRequestImages',
                                        key: 'images',
                                        render: (images: ServiceRequestImage[]) => (
                                            <div className="flex gap-2">
                                                {images.slice(0, 4).map((image) => (
                                                    <div
                                                        key={image.id}
                                                        onClick={() => showModal(image.imageUrl, image.description)}  // Truyền mô tả khi nhấn vào ảnh
                                                        className="cursor-pointer"
                                                    >
                                                        <img
                                                            src={image.imageUrl}
                                                            alt={image.description}
                                                            className="w-20 h-20 object-cover"
                                                        />
                                                    </div>
                                                ))}
                                                {images.length > 4 && (
                                                    <button
                                                        className="text-blue-500 cursor-pointer"
                                                        onClick={() => showAllImagesModal(images)}
                                                    >
                                                        Xem tất cả...
                                                    </button>
                                                )}
                                            </div>
                                        ),
                                    }
                                ]}
                                rowKey="id"
                            />
                        </Card>
                    </div>
                    <Modal
                        visible={isModalVisible}
                        onCancel={handleCancel}
                        footer={null}
                        width={800}
                    >
                        <div className="text-center">
                            <img
                                src={selectedImageUrl || ''}
                                alt="Phóng to"
                                className="w-full h-auto object-contain"
                            />
                            <p className="mt-4 text-center">{selectedImageDescription}</p>
                        </div>
                    </Modal>
                    <Modal
                        visible={isAllImagesModalVisible}
                        onCancel={handleCancel}
                        footer={null}
                        width={1000}
                    >
                        <div className="flex gap-4 flex-wrap">
                            {request.statusHistory[0]?.serviceRequestImages.map((image: any) => (
                                <div key={image.id} className="w-1/3 p-2 cursor-pointer">
                                    <img
                                        src={image.imageUrl}
                                        alt={image.description}
                                        className="w-full h-48 object-cover"
                                        onClick={() => showModal(image.imageUrl, image.description)}
                                    />
                                    <p className="text-center mt-2">{image.description}</p>
                                </div>
                            ))}
                        </div>
                    </Modal>
                </div>
            ))}
        </div>
    );
};


export default ServiceRequestDetail;