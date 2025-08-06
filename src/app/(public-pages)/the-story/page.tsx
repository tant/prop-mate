'use client'
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { motion } from "motion/react"
import BottomNav from "@/components/layout/bottom-nav";
const story = [
	{
		type: "hero",
		title: "Câu chuyện về một tương lai khác cho nghề môi giới",
		desc: "Nắng Sài Gòn những ngày hè oi ả. Giữa dòng xe cộ hối hả, chúng tôi thường bắt gặp hình ảnh quen thuộc: một nhà môi giới tấp vội xe vào lề đường. Một tay giữ chiếc điện thoại đang nóng ran, tay kia vội vàng lướt Zalo, lục tìm trong hàng trăm tin nhắn chỉ để trả lời một câu hỏi của khách: 'Căn này hướng gì em? Diện tích chính xác bao nhiêu?'",
	},
	{
		type: "paragraph",
		text: "Chúng tôi thấy họ, những người môi giới năng động, không ngại mưa nắng, rong ruổi khắp các con phố để tìm kiếm những bất động sản tốt nhất. Chúng tôi thấy mồ hôi, thấy sự nỗ lực không ngừng nghỉ. Và chúng tôi cũng thấy cả những trăn trở phía sau.",
	},
	{
		type: "paragraph",
		text: "Đó là câu chuyện về một người anh trong nghề, sau nhiều ngày tâm huyết khảo sát, chụp ảnh một căn nhà 'hoa hậu', nắn nót viết từng dòng mô tả rồi đăng lên một diễn đàn lớn. Chỉ vài giờ sau, 'thành quả' của anh đã bị một người khác sao chép không thiếu một dấu phẩy, đăng lại với số điện thoại của họ. Công sức của anh bỗng chốc trở thành của người khác. Chúng tôi gọi đó là nỗi đau 'chôm hàng' – một nỗi đau âm ỉ mà gần như môi giới nào cũng từng nếm trải.",
	},
	{
		type: "paragraph",
		text: "Đó còn là câu chuyện về một nữ môi giới trẻ đầy nhiệt huyết. Cô có hàng trăm khách hàng tiềm năng, nhưng thông tin của họ lại nằm rải rác khắp nơi: một ít trong sổ tay, một ít trong file Excel trên laptop, phần lớn còn lại là trong các cuộc trò chuyện Zalo đã trôi từ rất lâu. Khi một khách hàng cũ gọi lại, cô lúng túng vì không thể nhớ ngay họ đã từng xem căn nào, nhu cầu chính xác của họ là gì. Sự chuyên nghiệp mà cô luôn cố gắng xây dựng đã bị lung lay chỉ vì những công cụ làm việc rời rạc.",
	},
	{
		type: "paragraph",
		text: "Tại WitData, chúng tôi chuyên giúp các doanh nghiệp biến dữ liệu thành sức mạnh. Chúng tôi tin rằng công nghệ sinh ra là để phục vụ con người, để giải phóng họ khỏi những công việc lặp đi lặp lại và trao cho họ quyền kiểm soát. Nhìn vào những khó khăn của các nhà môi giới tại Việt Nam, chúng tôi nhận ra rằng: câu chuyện của họ không nhất thiết phải tiếp diễn như vậy.",
	},
	{
		type: "paragraph",
		text: "Sự cần cù và nỗ lực của họ xứng đáng được hỗ trợ bởi một công cụ tốt hơn. Một công cụ không chỉ để 'ghi chép', mà là một người trợ lý đắc lực, một bộ não thứ hai tin cậy.",
	},
	{
		type: "question",
		text: "Sẽ ra sao nếu người môi giới có thể đứng trước mặt khách hàng, tự tin mở điện thoại và mọi thông tin về bất động sản, từ hình ảnh, pháp lý đến giá cả, đều hiện ra ngay lập tức – ngay cả khi không có mạng?",
	},
	{
		type: "question",
		text: "Sẽ ra sao nếu mọi thông tin quý giá họ thu thập được đều nằm trong một 'két sắt' số an toàn, chỉ họ mới có quyền truy cập và chia sẻ cho đúng người, đúng thời điểm?",
	},
	{
		type: "question",
		text: "Và sẽ ra sao nếu mỗi tương tác với khách hàng đều được ghi nhận, giúp họ xây dựng một mối quan hệ bền chặt và chuyên nghiệp hơn?",
	},
	{
		type: "paragraph",
		text: "Đó chính là lúc ý tưởng về ứng dụng này ra đời. Nó không bắt nguồn từ một bản kế hoạch kinh doanh phức tạp, mà từ sự thấu cảm chân thành. Chúng tôi muốn dùng thế mạnh của mình về công nghệ và dữ liệu để viết tiếp một chương mới cho câu chuyện của nghề môi giới tại Việt Nam.",
	},
	{
		type: "paragraph",
		text: "Một chương truyện hiện đại hơn, nơi dữ liệu được số hóa và tập trung. Một chương truyện hiệu quả hơn, nơi thời gian được dùng để tư vấn và chốt giao dịch, thay vì quản lý thủ công. Và trên hết, là một chương truyện vui vẻ hơn, nơi người môi giới có thể tự tin làm chủ công việc của mình, giảm bớt căng thẳng và tìm thấy nhiều niềm vui hơn trên con đường sự nghiệp mà họ đã chọn.",
	},
	{
		type: "paragraph",
		text: "Chúng tôi không chỉ xây dựng một ứng dụng. Chúng tôi đang kiến tạo một tương lai khác – một tương lai mà chúng tôi tin rằng mọi nhà môi giới đều xứng đáng có được.",
	},
];

const fadeUp = {
	hidden: { opacity: 0, y: 40 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

export default function TheStoryPage() {
	return (
		<>
			<main className="min-h-screen w-full bg-gradient-to-br from-white via-blue-50 to-yellow-100 flex flex-col items-center px-2 pb-20">
				<motion.section
					initial="hidden"
					animate="visible"
					variants={fadeUp}
					className="w-full max-w-2xl text-center mt-10 mb-8"
				>
					<h1 className="text-4xl md:text-5xl font-extrabold text-blue-700 mb-4 drop-shadow-lg">
						{story[0].title}
					</h1>
					<p className="text-lg md:text-xl text-gray-700 font-medium leading-relaxed">
						{story[0].desc}
					</p>
				</motion.section>
				<Separator className="w-32 mb-8" />
				<div className="w-full max-w-2xl space-y-8">
					{story.slice(1).map((block, idx) => (
						<motion.div
							key={idx}
							initial="hidden"
							whileInView="visible"
							viewport={{ once: true, amount: 0.5 }}
							variants={fadeUp}
						>
							{block.type === "paragraph" && (
								<Card className="p-6 bg-white/80 shadow-lg border-0">
									<p className="text-base md:text-lg text-gray-800 leading-relaxed">
										{block.text}
									</p>
								</Card>
							)}
							{block.type === "question" && (
								<div className="my-6 flex justify-center">
									<motion.div
										initial={{ scale: 0.9, opacity: 0 }}
										whileInView={{ scale: 1.05, opacity: 1 }}
										transition={{ duration: 0.7, type: "spring" }}
										className="px-6 py-4 rounded-xl bg-gradient-to-r from-yellow-300 via-orange-200 to-blue-200 shadow-xl border-2 border-yellow-400 text-xl md:text-2xl font-bold text-blue-900 animate-pulse"
									>
										{block.text}
									</motion.div>
								</div>
							)}
						</motion.div>
					))}
				</div>
				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.5 }}
					variants={fadeUp}
					className="mt-16 text-center"
				>
					<h2 className="text-2xl md:text-3xl font-bold text-orange-600 mb-2 animate-bounce">
						Hãy cùng kiến tạo một tương lai mới cho nghề môi giới!
					</h2>
					<p className="text-lg text-gray-600">
						PropMate – Sức mạnh dữ liệu, sức mạnh của bạn.
					</p>
				</motion.div>
			</main>
			<BottomNav />
		</>
	);
}
