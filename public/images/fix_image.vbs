' Create a new JPEG file from scratch
Const FSO = CreateObject("Scripting.FileSystemObject")
Const inputStream = FSO.OpenTextFile("C:\Users\ibrah\OneDrive\Desktop\PORTFOLIO\portfolio-pro\public\images\profile.bak", 1)
Const outputStream = FSO.CreateTextFile("C:\Users\ibrah\OneDrive\Desktop\PORTFOLIO\portfolio-pro\public\images\profile.jpg", 2, True)

Dim imageData()
imageData = inputStream.ReadAll()

' Write the image data to the new file
outputStream.Write imageData

' Clean up
inputStream.Close
outputStream.Close

Set FSO = Nothing

MsgBox "Image file recreated successfully!", vbInformation, "Success"
End Sub
